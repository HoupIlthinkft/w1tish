from fastapi import status, FastAPI
from starlette.websockets import WebSocketState, WebSocket, WebSocketDisconnect
from backend.interfaces.protocols import IChatRepository, IMessagesRepository
from backend import models
from backend.interfaces import protocols
from backend import errors as err
from contextlib import asynccontextmanager
from logging import getLogger
from pydantic import ValidationError
from json.decoder import JSONDecodeError
import asyncio

logger = getLogger(__name__)

async def val_err_hand(socket: WebSocket): await socket.send_json({"type":"error", "detail":"Invalid message format"})
async def json_decode_err_hand(socket: WebSocket): await socket.send_json({"type":"error", "detail":"Invalid JSON format"})
async def sock_disc_err_hand(socket: WebSocket): raise WebSocketDisconnect()

HANDLERS = {
    ValidationError: val_err_hand,
    JSONDecodeError: json_decode_err_hand,
    WebSocketDisconnect: sock_disc_err_hand
}

@asynccontextmanager
async def error_handler(socket: WebSocket):
    try:
        yield
    except Exception as e:
        for error, handler in HANDLERS.items():
            if isinstance(e, error):
                await handler(socket)
                return
            
        await socket.send_json({
            "type":"error",
            "detail":"Iternal server error"
        })

class WebSocketManager:
    pool: dict[str, list[WebSocket]] = {}
    background_check = False

    def __init__(self, app: FastAPI, chat_rep_class: IChatRepository, mess_rep_class: IMessagesRepository):
        self._lock = asyncio.Lock()
        self.app = app
        self.chat_repo_temlate = chat_rep_class
        self.mess_repo: protocols.IMessagesRepository = mess_rep_class(app.state.mg_session)

    @asynccontextmanager
    async def lifespan(self):
        self.background_check = True
        yield
        self.background_check = False

    @asynccontextmanager
    async def then_socket_in_pool(self, socket: WebSocket, user_id: str):
        async with self._lock:
            if user_socks := self.pool.get(user_id):
                user_socks.append(socket)
            else:
                self.pool[user_id] = [socket]

        yield

        async with self._lock:
            if user_socks := self.pool.get(user_id):
                if socket in user_socks:
                    if socket.client_state != WebSocketState.DISCONNECTED:
                        await socket.close()
                    user_socks.remove(socket)
            else:
                self.pool.pop(user_id, None)

    async def _send_message(self, message: models.MessageModel, user_id: str) -> None:
        logger.info("Checking connection to " + str(user_id))
        if user_id in self.pool:
            logger.info("Connected to user")
            tasks = [
                sock.send_text(message.model_dump_json())
                for sock in self.pool.get(user_id)
            ]
            logger.info("Waiting broadcast...")
            await asyncio.gather(*tasks, return_exceptions=True)
            logger.info("Done!")

    async def _recive_message(self, socket: WebSocket):
        async with error_handler(socket):
            raw_message = await socket.receive_json()
            message = models.MessageModel.model_validate(raw_message)
            return message

    async def _background_check(self, socket: WebSocket):
        while self.background_check:

            message = await self._recive_message(socket)
            if not message:
                continue

            await self.broadcast(message)

    async def connect(self, socket: WebSocket, user_id: str) -> None:
        await socket.accept()
        logger.info("[WS] Client connected. ID: " + user_id)
        async with self.then_socket_in_pool(socket, user_id):
            try:
                await self._background_check(socket)
            except WebSocketDisconnect: ...
        logger.info("[WS] Client disconnected. ID: " + user_id)

    async def broadcast(self, message: models.MessageModel):
        async with self.app.state.pg_session_maker() as session:
            chat_repo: protocols.IChatRepository = self.chat_repo_temlate(session, self.app.state.generator)
            chat = await chat_repo.get_chat_by_id(message.chat_id)
            try:
                async with chat_repo.set_chat(message):
                    await self.mess_repo.add_message(message)
            except:
                await session.rollback()
                raise
            else: await session.commit()

        for user_id in chat.permissions:
            logger.info("Trying send message to " + user_id)
            await self._send_message(message, user_id)
