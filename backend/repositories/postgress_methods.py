from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, cast, String, update

from backend import errors as err
from backend import models
from backend.interfaces import protocols

from contextlib import asynccontextmanager
from datetime import datetime
from typing import AsyncGenerator


from logging import getLogger
logger = getLogger(__name__)


class AuthRepository:

    def __init__(
        self,
        db: AsyncSession,
        encrypter: protocols.IPasswordEncrypter,
        generator: protocols.IIdGenerator
    ):
        self.db = db
        self.encrypter = encrypter
        self.generator = generator

    async def register_new(
        self, 
        username: str,
        email: str,
        password: str
    ) -> str:
        encrypted_password = await self.encrypter.encrypt_password(password)
        user_id = await self.generator.generate_userid()
        try:
            new_user = models.UsersBase(
                id=user_id,
                username=username,
                nickname=username,                                   # при регистрации ставим ник по умолчанию username
                email=email,
                password_hash=encrypted_password
            )

            self.db.add(new_user)
            await self.db.flush()

            return str(user_id)
        
        except IntegrityError:
            raise err.UserExistError()


    async def check_user(self, username: str) -> models.UsersBase:
        query = await self.db.execute(
            select(models.UsersBase).where(
                models.UsersBase.username == username
            )
        )
        user = query.scalar_one_or_none()
        if user:
            return user
        raise err.UserNotFoundError()


    async def auth_user(self, username: str, password: str) -> str:
        user = await self.check_user(username)

        if await self.encrypter.validate_password(password, user.password_hash):
            return str(user.id)
        
        raise err.WrongPasswordError()   

class ChatRepository:
    def __init__(
        self,
        db: AsyncSession,
        generator: protocols.IIdGenerator
    ):
        self.db = db
        self.generator = generator
    
    async def get_user_chats(self, user_id: str) -> set[str]:
        query = await self.db.execute(
            select(
                cast(models.ChatsBase.id, String)
            ).where(
                models.ChatsBase.permissions.has_key(user_id)
            )
        )
        chats = query.scalars().all()
        if not chats:
            raise err.ChatNotFoundError()
        return set(chats)

    async def add_chat(self, permissions: dict) -> str:
        chat_id = self.generator.generate_chatid([int(k) for k in permissions])
        try:
            new_chat = models.ChatsBase(
                id=chat_id,
                permissions = permissions
            )
            self.db.add(new_chat)
            await self.db.flush()

            return str(chat_id)
    
        except IntegrityError:
                raise err.ChatExistError()
    
    @asynccontextmanager
    async def set_chat(self, message: models.MessageModel) -> AsyncGenerator[None, None]:
        logger.info("Starting update data...")
        await self.db.execute(
            update(
                models.ChatsBase
            ).where(
                models.ChatsBase.id == int(message.chat_id)
            ).values(
                last_message_author = int(message.sender),
                last_message_text = message.content,
                last_message_time = message.created_at
            )
        )
        logger.info(message.model_dump())
        yield
        logger.info("Done!")

    async def get_chat_by_id(self, chat_id: str) -> models.ChatModel:
        query = await self.db.execute(
            select(
                cast(models.ChatsBase.id, String),
                models.ChatsBase.permissions
            ).where(
                models.ChatsBase.id == int(chat_id)
            )
        )
        chats_data = query.one_or_none()
        logger.info(chats_data)
        if not chats_data:
            raise err.ChatNotFoundError()
        
        return models.ChatModel(id=str(chats_data[0]), permissions=chats_data[1])
    

class DataRepository:
    def __init__(self, session: AsyncSession):
        self.db = session
    
    async def get_user_data(self, user_id: str) -> models.UserResponse:
        query = await self.db.execute(
            select(
                cast(models.UsersBase.id, String).label("user_id"),
                models.UsersBase.username,
                models.UsersBase.nickname,
                cast(models.ChatsBase.id, String).label("chat_id"),
                cast(models.ChatsBase.last_message_author, String),
                models.ChatsBase.last_message_text,
                models.ChatsBase.last_message_time,
                models.ChatsBase.permissions
            ).outerjoin(
                models.ChatsBase,
                models.ChatsBase.permissions.has_key(user_id)
            ).where(
                models.UsersBase.id == int(user_id)
            )
        )
        user_data = query.all()

        if not user_data:
            raise err.UserNotFoundError()

        chats = {
            row.chat_id: {
                "last_message": row.last_message_text,
                "last_message_time": datetime.isoformat(row.last_message_time),
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
    
    async def get_users_by_ids(self, ids: list[str]) -> models.UsersResponse:
        query = await self.db.execute(
            select(
                models.UsersBase.nickname,
                cast(models.UsersBase.id, String),
                models.UsersBase.username
            ).where(
                cast(models.UsersBase.id, String).in_(ids)
            )
        )
        users_data = query.mappings().all()

        if len(users_data) != len(set(ids)):
            logger.warning(f"Failed to get users data! Getted {len(users_data)}/{len(ids)}")
            raise err.UserNotFoundError()
        
        return models.UsersResponse.model_validate({"users":users_data})
    

    async def get_users_by_usernames(self, usernames: list[str]) -> models.UsersResponse:
        query = await self.db.execute(
            select(
                models.UsersBase.nickname,
                cast(models.UsersBase.id, String),
                models.UsersBase.username
            ).where(
                models.UsersBase.username.in_(usernames)
            )
        )
        users_data = query.mappings().all()

        if len(users_data) != len(set(usernames)):
            logger.warning("Failed to get users data! Getted %s/%s", len(users_data), len(usernames))
            raise err.UserNotFoundError()
        
        return models.UsersResponse.model_validate({"users":users_data})
    
    async def set_user_nickname(self, nickname: str, user_id: str) -> None:
        query = await self.db.execute(
            update(
                models.UsersBase
            ).where(
                models.UsersBase.id == int(user_id)
            ).values(
                nickname=nickname
            )
        )
        if not query.rowcount:
            raise err.UserNotFoundError()
        

class KeysRepository:
    def __init__(self, session: AsyncSession):
        self.db = session

    async def add_prekeys(self, user_id: str, keys: list[str]) -> None:
        objects = [
            models.PreKeysBase(
                id=int(user_id),
                key=key
            ) for key in keys
        ]
        await self.db.add_all(objects)

    async def get_prekey(self, user_id: str) -> str:
        query = await self.db.execute(
            select(
                models.PreKeysBase
            ).where(
                models.PreKeysBase.id == int(user_id)
            ).limit(1)
        )
        key = query.scalar_one_or_none()
        if key:
            await self.db.delete(key)
            return key.key
        
        logger.warning(f"Noone prekeys was searched for user '{user_id}'")
        raise err.NoPreKeysError()
    
    async def update_signed_key(self, user_id: str, signed_key: str) -> None:
        query = await self.db.execute(
            update(
                models.PublicKeysBase.signed_prekey
            ).where(
                models.PublicKeysBase.id == int(user_id)
            ).values(
                signed_prekey=signed_key
            )
        )
        if not query.rowcount:
            raise err.UserNotFoundError()
    
    async def get_user_keys(self, user_id: str) -> models.UserKeysResponse:
        query = await self.db.execute(
            select(
                models.PublicKeysBase
            ).where(
                models.PublicKeysBase.id == int(user_id)
            )
        )
        public_keys = query.scalar_one_or_none()
        if not public_keys: raise err.UserNotFoundError()

        return models.UserKeysResponse(
            identity_key=public_keys.identity_key,
            signed_key=public_keys.signed_prekey,
            pre_key=None
        )
