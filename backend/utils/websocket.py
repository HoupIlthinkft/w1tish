from fastapi import WebSocket, WebSocketDisconnect, status, FastAPI
from backend.interfaces.protocols import IChatRepository, IMessagesRepository
from backend import models
from backend import errors as err
from contextlib import asynccontextmanager
from logging import getLogger
from pydantic import ValidationError
from json.decoder import JSONDecodeError
import asyncio

logger = getLogger(__name__)

class WebSocketManager:
    pool: dict[int, list[WebSocket]] = {}
    background_check = False

    def __init__(self, app: FastAPI, chat_rep_class: IChatRepository, mess_rep_class: IMessagesRepository):
        self.app = app
        self.chat_repo_temlate = chat_rep_class
        self.mess_repo = mess_rep_class(app.state.mg_session)

    async def _clear_dead_sockets(self, user_id: int) -> None:
        if user_sockets := self.pool.get(user_id):
            pings = [sock.send_json({"type":"ping"}) for sock in user_sockets]
            results = await asyncio.gather(*pings, return_exceptions=True)
            alive_sockets = []
            for socket, result in zip(user_sockets, results):
                if not isinstance(result, Exception):
                    alive_sockets.append(socket)
            if alive_sockets:
                self.pool[int(user_id)] = alive_sockets
            else: del self.pool[int(user_id)]


    async def _send_message(self, message: models.MessageModel, user_id: int) -> None:
        logger.debug("Checking connection to " + str(user_id))
        if user_id in self.pool:
            logger.debug("Connected to user")
            tasks = [
                sock.send_json(message.model_dump()) for sock in self.pool[user_id]
            ]
            results = await asyncio.gather(
                *tasks,
                return_exceptions=True
            )
            for result in results:
                if isinstance(result, Exception): 
                    raise result
            
    
    async def _background_check(self, socket: WebSocket, user_id: int):
        if user_socks := self.pool.get(user_id):
            user_socks.append(socket)
        else:
            self.pool[user_id] = [socket]

        try:
            while self.background_check:
                try:
                    message = await socket.receive_json()

                    try:
                        message = models.MessageModel.model_validate(message)
                    except ValidationError:
                        await socket.send_json({"type":"error", "detail": "Invalid message format!"})

                    # тут контекстный менеджер обновления метаданных + сохранение в mongo

                    else:
                        task = asyncio.create_task(self.broadcast(message))
                        try:
                            await task
                        except err.BaseAppException:
                            await socket.send_json({"type":"error", "detail": "Invalid message format!"})

                except JSONDecodeError:
                     await socket.send_json({"type":"error", "detail": "Invalid JSON format!"})

            await socket.close(status.WS_1012_SERVICE_RESTART)

        except WebSocketDisconnect:
            logger.info("[WS] Client disconected")
            await self._clear_dead_sockets(user_id)



    @asynccontextmanager
    async def lifespan(self):
        self.background_check = True
        yield
        self.background_check = False


    async def connect(self, socket: WebSocket, user_id: int) -> None:
        await socket.accept()
        logger.info("[WS] Client connected. ID: " + str(user_id))
        await socket.send_json({"type":"info", "id": user_id})
        await self._background_check(socket, user_id)


    async def broadcast(self, message: models.MessageModel):
        async with self.app.state.pg_session_maker() as session:
            chat_repo = self.chat_repo_temlate(session)
            chat = await chat_repo.get_chat_by_id(message.chat_id)
        for user_id in chat.permissions:
            logger.debug("Trying send message to " + user_id)
            await self._send_message(message, user_id)
