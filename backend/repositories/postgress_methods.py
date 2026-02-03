from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, cast, String, update

from backend.errors import UserExistError, UserNotFoundError, WrongPasswordError, ChatNotFoundError
from backend import models
from backend.interfaces import protocols

from contextlib import asynccontextmanager
from datetime import datetime
from typing import AsyncGenerator

from logging import getLogger
logger = getLogger(__name__)


class AuthRepository:

    def __init__(self, db: AsyncSession, encrypter: protocols.IPasswordEncrypter):
        self.db = db
        self.encrypter = encrypter

    async def register_new(
        self, 
        username: str,
        email: str,
        password: str
    ) -> int:
        encrypted_password = await self.encrypter.encrypt_password(password)
        try:
            new_user = models.usersBase(
                username=username,
                nickname=username,                                   # при регистрации ставим ник по умолчанию username
                email=email,
                password_hash=encrypted_password
            )

            self.db.add(new_user)
            await self.db.commit()
            await self.db.refresh(new_user)

            return new_user.id
        
        except IntegrityError:
            await self.db.rollback()
            raise UserExistError()


    async def check_user(self, username: str) -> models.usersBase:
        query = await self.db.execute(
            select(models.usersBase).where(
                models.usersBase.username == username
            )
        )
        user = query.scalar_one_or_none()
        if user is None:
            raise UserNotFoundError()
        
        return user


    async def auth_user(self, username: str, password: str) -> int:
        user = await self.check_user(username)

        if await self.encrypter.validate_password(password, user.password_hash):
            return user.id
        
        raise WrongPasswordError()
    

class ChatRepository:
    def __init__(self, db: AsyncSession): self.db = db
    
    async def get_user_chats(self, user_id: int) -> list[int]:
        query = await self.db.execute(
            select(
                models.chatsBase.id
            ).where(
                models.chatsBase.permissions.has_key(cast(str(user_id), String))
            )
        )
        chats = query.scalars().all()
        if not chats:
            raise ChatNotFoundError()
        return chats

    async def add_chat(self, permissions: dict) -> str:
        new_chat = models.chatsBase(
            permissions = permissions
        )
        self.db.add(new_chat)
        await self.db.commit()
        await self.db.refresh(new_chat)

        return str(new_chat.id)
    
    @asynccontextmanager
    async def set_chat(self, message: models.MessageModel) -> AsyncGenerator[None, None]:
        try:
            await self.db.execute(
                update(
                    models.chatsBase
                ).where(
                    models.chatsBase.id == int(message.chat_id)
                ).values(
                    last_message_author = int(message.sender),
                    last_message_text = message.content,
                    last_message_time = datetime.fromisoformat(message.created_at)
                )
            )
            yield
            await self.db.commit()
        
        except:
            await self.db.rollback()
            raise
    

class DataRepository:
    def __init__(self, session: AsyncSession):
        self.db = session
    
    async def get_user_data(self, user_id: int) -> models.UserResponse:
        query = await self.db.execute(
            select(
                models.usersBase.id.label("user_id"),
                models.usersBase.username,
                models.usersBase.nickname,
                models.chatsBase.id.label("chat_id"),
                models.chatsBase.last_message_author,
                models.chatsBase.last_message_text,
                models.chatsBase.last_message_time,
                models.chatsBase.permissions
            ).outerjoin(
                models.chatsBase,
                models.chatsBase.permissions.has_key(cast(str(user_id), String))
            ).where(
                models.usersBase.id == user_id
            )
        )
        user_data = query.all()

        if not user_data:
            raise UserNotFoundError()

        chats = {
            row.chat_id: {
                "last_message": row.last_message_text,
                "last_message_time": row.last_message_time,
                "last_message_author": row.last_message_author,
                "permissions": row.permissions
            }
            for row in user_data if row.chat_id is not None
        }

        response = models.UserResponse(
            id=user_data[0].user_id,
            username=user_data[0].username,
            nickname=user_data[0].nickname,
            chats=chats
        )

        return response
    
    async def get_users_by_ids(self, ids: list[int]) -> models.UsersResponse:
        query = await self.db.execute(
            select(
                models.usersBase.nickname,
                models.usersBase.id,
                models.usersBase.username
            ).where(
                models.usersBase.id.in_(ids)
            )
        )
        users_data = query.mappings().all()

        if len(users_data) != len(set(ids)):
            logger.warning(f"Failed to get users data! Getted {len(users_data)}/{len(ids)}")
            raise UserNotFoundError()
        
        return models.UsersResponse.model_validate({"users":users_data})
    

    async def get_users_by_usernames(self, usernames: list[str]) -> models.UsersResponse:
        query = await self.db.execute(
            select(
                models.usersBase.nickname,
                models.usersBase.id,
                models.usersBase.username
            ).where(
                models.usersBase.username.in_(usernames)
            )
        )
        users_data = query.mappings().all()

        if len(users_data) != len(set(usernames)):
            logger.warning(f"Failed to get users data! Getted %s/%s", len(users_data), len(usernames))
            raise UserNotFoundError()
        
        return models.UsersResponse.model_validate({"users":users_data})
    
    async def set_user_nickname(self, nickname: str, user_id: int) -> None:
        query = await self.db.execute(
            update(
                models.usersBase
            ).where(
                models.usersBase.id == user_id
            ).values(
                nickname=nickname
            )
        )
        if query.rowcount:
            await self.db.commit()
        else:
            raise UserNotFoundError()