from typing import Annotated
from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from pymongo.asynchronous.database import AsyncDatabase
from backend.utils.security.password_encrypt import PasswordEncrypterRepository
from backend.utils.cloud import AvatarLoaderRepository
from typing import AsyncGenerator

async def get_async_db(request: Request) -> AsyncGenerator[AsyncSession, None]:
    async with request.app.state.pg_session() as session:
        yield session

def get_messages_session(request: Request) -> AsyncDatabase:
    return request.app.state.mg_session

def get_encrypter(request: Request) -> PasswordEncrypterRepository:
    return PasswordEncrypterRepository(request.app.state.executor)

def get_avatar_loader(request: Request) -> AvatarLoaderRepository:
    return AvatarLoaderRepository(request.app.state.executor, request.app.state.s3_client)

Database = Annotated[AsyncSession, Depends(get_async_db)]
MessageBase = Annotated[AsyncDatabase, Depends(get_messages_session)]
PasswordEncrypter = Annotated[PasswordEncrypterRepository, Depends(get_encrypter)]
AvatarLoader = Annotated[AvatarLoaderRepository, Depends(get_avatar_loader)]