from pydantic import BaseModel, Field

from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text, BigInteger, ForeignKey, Text, Integer
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship

import uuid
from datetime import datetime
from pydantic import BaseModel, Field


# основные модели

class Base(AsyncAttrs, DeclarativeBase): ...

class UserModel(BaseModel):
    id: str = Field(..., examples=["123456789012345678"], description="Айди пользователя")
    username: str = Field(..., examples=["Tralalelo_tralala"], description="Логин пользователя")
    nickname: str = Field(..., examples=["Гигачат 228 котлета 336"], description="Ник пользователя")
    avatar: str = Field("", examples=["https://28a5e24f-0510-42cb-9cc1-a389ee992516.selstorage.ru/default/1.jpg"], description="Аватар пользователя")

class ChatModel(BaseModel):
    id: str = Field(..., examples=["123456789012345678"], description="Айди чата")
    permissions: dict = Field(
        ...,
        description="Список участников",
        examples=[{
            "123456789012345678": "owner",
            "123456789012345677": "user"
        }]
    )

class ServerResponse(BaseModel):
    type: int
    content: str
    sender: str
    reciver: str
    chat_id: str

    messuid: str = Field(default_factory=lambda: uuid.uuid4().hex)
    created_at: datetime = Field(default_factory=datetime.now)

class MessagesDeliveredResponse(BaseModel):
    type: int
    delivered_ids: list[str]
    reciver: str

class FirstMessageModel(BaseModel):
    type: int = Field(..., examples=[1], description="Тип сообщения")
    content: str = Field(..., examples=["Васап бро"], description="Сообщение")
    sender: str = Field(..., examples=["52"], description="Айди отправителя")
    reciver: str = Field(..., examples=["42"], description="Айди получателя")

class MessageModel(BaseModel):
    type: int = Field(..., examples=[1], description="Тип сообщения")
    chat_id: str  = Field(..., examples=["42"], description="Айди чата")
    content: str = Field(..., examples=["Васап бро"], description="Сообщение")
    sender: str = Field(..., examples=["52"], description="Айди отправителя")
    reciver: str = Field(..., examples=["42"], description="Айди получателя")

class PreKeyModel(BaseModel):
    pre_key: str = Field(..., examples=["FakEOneTimeKEuINBasE64"], description="Разовый ключ")
    index: int = Field(..., examples=[2], description="Индекс ключа на клиенте")


# модели запросов

class AuthRequestModel(BaseModel):
    username: str = Field(..., examples=["Tralalelo_tralala"], description="Логин пользователя")
    password: str = Field(..., examples=["Pinguin_228"], description="Пароль пользователя")

class RegisterRequestModel(AuthRequestModel):
    email: str = Field(..., examples=["polzovatel@w1tish.com"], description="Почта пользователя")

class CreateChatRequestModel(BaseModel):
    members_ids: list[str] = Field(..., examples=[["123456789012345678", "123456789012345677"]], description="Список айди участников")

class GetMessagesRequestModel(BaseModel):
    chat_id: str = Field(..., examples=["123456789012345678"], description="Айди чата")
    limit: int = Field(50, description="Колличество сообщений для получения")
    offset: int = Field(0, description="Смещение в сообщениях")

class SendMessagesRequestModel(BaseModel):
    messages: list[MessageModel] = Field(..., description="Сообщения")

class SetNicknameModel(BaseModel):
    nickname: str = Field(..., description="Новый никнейм пользователя", examples=["Пельмень 228 котлета 336"])

class SignedPreKeyModel(BaseModel):
    index: int = Field(..., examples=[1], description="Порядковый номер ключа")
    signed_prekey: str = Field(..., examples=["blkBElfkjeblkJBWLEKjfbwlkjBWLKEfjbwlk"], description="Подписанный ключ шифоования пользователя")
    signature: str = Field(..., examples=["JHEkjhfLKWJEhflkhfjekhwlKWJHEF"], description="Подпись ключа")

class SetAllKeysRequestModel(BaseModel):
    registration_id: int = Field(..., examples=[1488], description="Уникальный айди регистрации пользователя (уникален на кождом девайсе)")
    identity_key: str = Field(..., examples=["FaKeIdenTiTyKeYwiThBase64EnCoDInG="], description="Идентификационный ключ пользователя")
    signed_key: SignedPreKeyModel = Field(..., description="Подписанный ключ шифоования пользователя")
    pre_keys: list[PreKeyModel] = Field(..., description="Разовые ключи для создания чата")

class AddPreKeysResponseModel(BaseModel):
    pre_keys: list[PreKeyModel] = Field(..., description="Разовые ключи для создания чата")


# модели ответов

class OKResponse(BaseModel):
    status: str = "OK"

class AccessTokenResponse(BaseModel):
    access_token: str = Field(..., description="Access токен", examples=["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"])

class TokensResponse(AccessTokenResponse):
    refresh_token: str = Field(..., description="Refresh токен", examples=["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"])

class MessagesResponse(SendMessagesRequestModel): ...

class CreateChatResponse(BaseModel):
    chat_id: str = Field(..., description="Айди чата", examples=["123456789012345678"])

class UserResponse(UserModel):
    chats: dict[str, list[str]] = Field(
        ...,
        description="Чаты пользователя",
        examples=[{
            "123456789012345678": ["123456789012345678", "123456789012345677"]
        }]
    )

class UsersResponse(BaseModel):
    users: list[UserModel] = Field(..., description="Данные пользователей")

class UserKeysResponse(BaseModel):
    registration_id: int = Field(..., examples=[1488], description="Уникальный айди регистрации пользователя (уникален на кождом девайсе)")
    identity_key: str = Field(..., examples=["hjbjkHEBKJhbkfjhBKSJHEbfowiefhbWO"], description="Публичный ключ идентификации пользователя")
    signed_key: SignedPreKeyModel = Field(..., description="Публичный, подписанный ключ шифрования пользователя")
    pre_key: PreKeyModel | None = Field(..., description="Публичный, разовый ключ шифрования пользователя")

# базы данных

class ChatsBase(Base):
    __tablename__ = "chats"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    permissions: Mapped[dict[str, str]] = mapped_column(JSONB, server_default=text("'{}'::jsonb"))

class UsersBase(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    username: Mapped[str] = mapped_column(Text, unique=True, index=True, nullable=False)
    nickname: Mapped[str] = mapped_column(Text, nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(Text, nullable=False)

    public_keys: Mapped[list["PublicKeysBase"]] = relationship("PublicKeysBase", back_populates="user")
    pre_keys: Mapped[list["PreKeysBase"]] = relationship("PreKeysBase", back_populates="user")


class PublicKeysBase(Base):
    __tablename__ = "public_keys"

    keys_id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    id: Mapped[int] = mapped_column(BigInteger, ForeignKey('users.id'), nullable=False, unique=True)
    
    identity_key: Mapped[str] = mapped_column(Text, nullable=False)
    registration_id: Mapped[int] = mapped_column(Integer, nullable=False)

    index: Mapped[int] = mapped_column(Integer, nullable=False)
    signed_prekey: Mapped[str] = mapped_column(Text, nullable=False)
    signature: Mapped[str] = mapped_column(Text, nullable=False)

    user: Mapped["UsersBase"] = relationship("UsersBase", back_populates="public_keys")


class PreKeysBase(Base):
    __tablename__ = "pre_keys"

    key_id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    id: Mapped[int] = mapped_column(BigInteger, ForeignKey('users.id'), nullable=False)
    
    key: Mapped[str] = mapped_column(Text, nullable=False)
    index: Mapped[int] = mapped_column(Integer, nullable=False)

    user: Mapped["UsersBase"] = relationship("UsersBase", back_populates="pre_keys")


