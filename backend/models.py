from pydantic import BaseModel, Field

from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column


# основные модели

class Base(AsyncAttrs, DeclarativeBase): ...

class UserModel(BaseModel):
    id: int = Field(..., examples=[52], description="Айди пользователя")
    username: str = Field(..., examples=["Tralalelo_tralala"], description="Логин пользователя")
    nickname: str = Field(..., examples=["Гигачат 228 котлета 336"], description="Ник пользователя")

class ChatModel(BaseModel):
    id: str = Field(..., examples=["42"], description="Айди чата")
    members: list[UserModel] = Field(..., description="Список участников")

class MessageModel(BaseModel):
    chat_id: str = Field(..., examples=["42"], description="Айди чата")
    content: str = Field(..., examples=["Васап бро"], description="Сообщение")
    sender: int = Field(..., examples=[52], description="Айди отправителя")
    created_at: str = Field(..., examples=["2026-01-31T21:35:10.161344"], description="Дата отправки")


# модели запросов

class AuthRequestModel(BaseModel):
    username: str = Field(..., examples=["Tralalelo_tralala"], description="Логин пользователя")
    password: str = Field(..., examples=["Pinguin_228"], description="Пароль пользователя")

class RegisterRequestModel(AuthRequestModel):
    email: str = Field(..., examples=["polzovatel@w1tish.com"], description="Почта пользователя")

class CreateChatRequestModel(BaseModel):
    members_ids: list[int] = Field(..., examples=[[1, 2]], description="Список айди участников")

class GetMessagesRequestModel(BaseModel):
    chat_id: int = Field(..., examples=["42"], description="Айди чата")
    limit: int = Field(50, description="Колличество сообщений для получения")
    offset: int = Field(0, description="Смещение в сообщениях")

class SendMessagesRequestModel(BaseModel):
    messages: list[MessageModel] = Field(..., description="Сообщения")

class SetNicknameModel(BaseModel):
    nickname: str = Field(..., description="Новый никнейм пользователя", examples=["Пельмень 228 котлета 336"])


# модели ответов

class OKResponse(BaseModel):
    status: str = "OK"

class AccessTokenResponse(BaseModel):
    access_token: str = Field(..., description="Access токен", examples=["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"])

class TokensResponse(AccessTokenResponse):
    refresh_token: str = Field(..., description="Refresh токен", examples=["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"])

class MessagesResponse(SendMessagesRequestModel): ...

class CreateChatResponse(BaseModel):
    chat_id: str = Field(..., description="Айди чата", examples=["52"])

class UserResponse(UserModel):
    chats: dict = Field(
        ...,
        description="Чаты пользователя",
        examples=[{
            "id": "42",
            "last_message_text": "лох",
            "last_message_time": "2026-01-31T21:35:10.161344",
            "last_message_author": 52,
            "permissions": {52: "owner", 42: "user"}
        }]
    )

class UsersResponse(BaseModel):
    users: list[UserModel] = Field(..., description="Данные пользователей")


# базы данных

class usersBase(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
    nickname: Mapped[str] = mapped_column(nullable=False)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(nullable=False)

class chatsBase(Base):
    __tablename__ = "chats"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    last_message_text: Mapped[str] = mapped_column(server_default=text("'_Чат создан_'"))
    last_message_time: Mapped[datetime] = mapped_column(server_default=text("now()"))
    last_message_author: Mapped[int] = mapped_column(server_default=text("0"))
    permissions: Mapped[dict] = mapped_column(JSONB, server_default=text("'{}'::jsonb"))

