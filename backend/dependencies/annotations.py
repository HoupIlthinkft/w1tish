from typing import Annotated
from fastapi import Depends, Request, WebSocket
from sqlalchemy.ext.asyncio import AsyncSession
from pymongo.asynchronous.database import AsyncDatabase
from backend.utils.security.password_encrypt import PasswordEncrypterRepository
from backend.utils.security.id_generator import SnowflakeIdGenerator
from backend.utils.cloud import AvatarLoaderRepository
from backend.utils.websocket import WebSocketManager
from backend import errors as err
from typing import AsyncGenerator
from logging import getLogger
logger = getLogger(__name__)

async def get_async_db(request: Request) -> AsyncGenerator[AsyncSession, None]:
    async with request.app.state.pg_session_maker() as session:
        session: AsyncSession
        try:
            yield session
            await session.commit()
        except err.NoCommitException:
            await session.rollback()
            raise

def get_websocket_manager(websocket: WebSocket) -> WebSocketManager:
    return websocket.app.state.manager

def get_messages_session(request: Request) -> AsyncDatabase:
    return request.app.state.mg_session

def get_encrypter(request: Request) -> PasswordEncrypterRepository:
    return PasswordEncrypterRepository(request.app.state.executor)

def get_avatar_loader(request: Request) -> AvatarLoaderRepository:
    return AvatarLoaderRepository(request.app.state.executor, request.app.state.s3_client)

def get_id_generator(request: Request) -> SnowflakeIdGenerator:
    return request.app.state.generator

Database = Annotated[AsyncSession, Depends(get_async_db)]
MessageBase = Annotated[AsyncDatabase, Depends(get_messages_session)]
PasswordEncrypter = Annotated[PasswordEncrypterRepository, Depends(get_encrypter)]
AvatarLoader = Annotated[AvatarLoaderRepository, Depends(get_avatar_loader)]
IdGenerator = Annotated[SnowflakeIdGenerator, Depends(get_id_generator)]