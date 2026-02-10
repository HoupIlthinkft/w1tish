from fastapi import WebSocket, WebSocketDisconnect, status, FastAPI
from backend.interfaces.protocols import IChatRepository, IMessagesRepository
from backend import models
from contextlib import asynccontextmanager
from logging import getLogger
from pydantic import ValidationError
from json.decoder import JSONDecodeError
import asyncio

logger = getLogger(__name__)

class WebSocketManager:

    def __init__(self, app: FastAPI, chat_rep_class: IChatRepository, mess_rep_class: IMessagesRepository):
        self.pool = {}
        self.background_check = False
        self.chat_repo = chat_rep_class(app.state.pg_session)
        self.mess_repo = mess_rep_class(app.state.mg_session)


    async def _send_message(self, message: models.MessageModel, user_id: int) -> None:
        logger.debug("Checking connection to " + str(user_id))
        if int(user_id) in self.pool:
            logger.debug("Connected to user")
            await self.pool[int(user_id)].send_json(message.model_dump_json())
            logger.debug("Message sent!")
    

    async def _background_check(self, socket: WebSocket, user_id: int):
        self.pool[user_id] = socket
        logger.info(self.pool)
        try:
            while self.background_check:
                try:
                    message = await socket.receive_json()

                    try:
                        message = models.MessageModel.model_validate(message)
                    except ValidationError:
                        await socket.send_json({"type":"error", "detail": "Invalid message format!"})
                    # тут контекстный менеджер обноления метаданных + сохранение в mongo
                    await self.broadcast(message)

                except JSONDecodeError:
                     await socket.send_json({"type":"error", "detail": "Invalid JSON format!"})

            await socket.close(status.WS_1012_SERVICE_RESTART)

        except WebSocketDisconnect:
            logger.info("[WS] Client disconected")
            del self.pool[user_id]


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
        chat = await self.chat_repo.get_chat_by_id(message.chat_id)
        for user_id in chat.permissions:
            logger.debug("Trying send message to " + user_id)
            await self._send_message(message, user_id)
