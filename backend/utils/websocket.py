from fastapi import FastAPI
from starlette.websockets import WebSocketState, WebSocket, WebSocketDisconnect
from backend.interfaces.protocols import IChatRepository, IMessagesRepository
from backend import models
from backend.interfaces import protocols
from abc import ABC, abstractmethod
from backend import errors as err
from contextlib import asynccontextmanager
from logging import getLogger
from pydantic import ValidationError
from json.decoder import JSONDecodeError
import asyncio
from pydantic import BaseModel, Field

from datetime import datetime

logger = getLogger(__name__)

async def val_err_hand(socket: WebSocket): await socket.send_json({"type":"error", "detail":"Invalid message format"})
async def json_decode_err_hand(socket: WebSocket): await socket.send_json({"type":"error", "detail":"Invalid JSON format"})
async def no_perms_hand(socket: WebSocket): await socket.send_json({"type":"error", "detail":"User hasnt permissions to write in this chat"})
async def sock_disc_err_hand(socket: WebSocket): raise WebSocketDisconnect()

class SocketMessage(BaseModel):
    content: str
    chat_id: str

    sender: str = Field("...")
    created_at: datetime = Field(default_factory=datetime.now)

class WebSockResponse(BaseModel):
    type: str
    content: SocketMessage | models.ChatModel

HANDLERS = {
    ValidationError: val_err_hand,
    JSONDecodeError: json_decode_err_hand,
    WebSocketDisconnect: sock_disc_err_hand,
    err.NoWritePermissionError: no_perms_hand
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

async def recive_message(socket: WebSocket):
    async with error_handler(socket):
        raw_message = await socket.receive_json()
        message = SocketMessage.model_validate(raw_message)
        return message
    
class SocketBase(ABC):
    pool: dict[str, list[WebSocket]] = {}
    background_check = False

    def __init__(self):
        self._lock = asyncio.Lock()
        self._logger = getLogger(__name__)

    async def _send_message(self, message: str, user_id: str) -> None:
        async def send_task(sock: WebSocket, message: str, user_id: str):
            self._logger.info(message + " to " + user_id)
            await sock.send_text(message)

        if user_id in self.pool:
            tasks = [
                send_task(sock, message, user_id)
                for sock in self.pool.get(user_id)
            ]
            await asyncio.gather(*tasks, return_exceptions=True)

    @abstractmethod
    async def _sock_worker(self, socket: WebSocket, user_id: str): ...

    @asynccontextmanager
    async def _then_socket_in_pool(self, socket: WebSocket, user_id: str):
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

    @asynccontextmanager
    async def lifespan(self):
        self.background_check = True
        yield
        self.background_check = False

    async def connect(self, socket: WebSocket, user_id: str) -> None:
        await socket.accept()
        self._logger.info("[WS] Client connected. ID: " + user_id)
        async with self._then_socket_in_pool(socket, user_id):
            try:
                await self._sock_worker(socket, user_id)
            except WebSocketDisconnect:
                self._logger.info("[WS] Client disconnected. ID: " + user_id)


class WebSocketManager(SocketBase):
    pool: dict[str, list[WebSocket]] = {}
    background_check = False

    def __init__(self, app: FastAPI, chat_rep_class: IChatRepository, mess_rep_class: IMessagesRepository):
        super().__init__()
        self._stack = asyncio.Queue()
        self.app = app
        self.chat_repo_temlate = chat_rep_class
        self.mess_repo: protocols.IMessagesRepository = mess_rep_class(app.state.mg_session)

    async def _sock_worker(self, socket: WebSocket, user_id: str):
        _ = asyncio.create_task(self._broadcast())
        while self.background_check:
            message = await recive_message(socket)
            if not message:
                continue
            
            message.sender = user_id
            response = WebSockResponse(type="message", content=message)
            await self._stack.put(response)

    async def _send_messages(
        self,
        message: WebSockResponse,
        chat_repo: protocols.IChatRepository,
        chat: models.ChatModel
    ) -> None:
            async with chat_repo.set_chat(message.content):
                await self.mess_repo.add_message(message.content)
            
            response = message.model_dump_json()
            for user_id in chat.permissions:
                await self._send_message(response, user_id)

    async def _broadcast(self):
        while self.background_check:
            message: WebSockResponse = await self._stack.get()

            if message.type == "chat":
                chat = message.content
                response = message.model_dump_json()
                for user_id in chat.permissions:
                    await self._send_message(response, user_id)
                continue

            async with self.app.state.pg_session_maker() as session:
                chat_repo: IChatRepository = self.chat_repo_temlate(session, self.app.state.generator)
                
                if message.type == "message":
                    chat = await chat_repo.get_chat_by_id(message.content.chat_id)
                    awarible_chats = await chat_repo.get_user_chats(message.content.sender)
                    if message.content.chat_id not in awarible_chats: raise err.NoWritePermissionError()

                    try:
                        await self._send_messages(message, chat_repo, chat)
                    except:
                        await session.rollback()
                        raise
                    else:
                        await session.commit()

    async def new_chat(self, chat: models.ChatModel):
        response = WebSockResponse(type="chat", content=chat)
        await self._stack.put(response)