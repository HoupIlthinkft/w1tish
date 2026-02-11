from contextlib import asynccontextmanager
from backend.interfaces import protocols
from backend import errors as err
from backend import models

class DataMock(protocols.IDataRepository):

    async def get_user_data(self, user_id: str) -> models.UserResponse:
        return models.UserResponse(
            id="52",
            username="test_user",
            nickname="Test User",
            chats={
                "id": "42",
                "last_message_text": "лох",
                "last_message_time": "2026-01-31T21:35:10.161344",
                "last_message_author": "52",
                "permissions": {"52": "owner", "42": "user"}
            }
        )

    async def get_users_by_ids(self, ids: list[str]) -> models.UsersResponse:
        return models.UsersResponse(
            users=[
                models.UserModel(
                    id="52",
                    username="test_user",
                    nickname="Test User"
                )
            ]
        )

    async def get_users_by_usernames(self, usernames: list[str]) -> models.UsersResponse:
        return await self.get_users_by_ids(["1"])

    async def set_user_nickname(self, nickname: str, user_id: str) -> None: ...


class AuthMock(protocols.IAuthRepository):

    async def auth_user(self, username, password) -> str:
        if username == password: raise err.UserNotFoundError()
        return "52"
    
    async def register_new(self, username, email, password) -> str:
        if username == email: raise err.UserExistError()
        return "52"


class BlackListMock(protocols.IBlacklistRepository):

    def __init__(self):
        self.blacklist = set()

    async def check_blacklist(self, token) -> bool:
        return token in self.blacklist
    
    async def unvalidate_token(self, token, live_time = 1) -> None:
        self.blacklist.add(token)


class AvatarMock(protocols.IAvatarLoader):

    async def load_avatar(self, avatar, user_id) -> None: ...

    async def set_default_avatar(self, user_id) -> None: ...


class ChatMock(protocols.IChatRepository):

    async def get_user_chats(self, user_id: str) -> list[str]: return ["52", "42", "67"]

    async def add_chat(self, permissions: dict) -> str: return "52"

    @asynccontextmanager
    async def set_chat(self, message: models.MessageModel): yield

    async def get_chat_by_id(self, chat_id: int) -> models.ChatModel:
        return models.ChatModel(
            id="52",
            permissions={
                "42": "owner",
                "52": "user"
            }
        )
    
class MessMock(protocols.IMessagesRepository):

    async def add_message(self, messages: models.MessageModel) -> None: ...

    async def get_messages_by_chat(self, chat_id: str, limit: int, offset: int) -> models.MessagesResponse:
        return models.MessagesResponse(
            messages=[
                models.MessageModel(
                    chat_id="52",
                    content="лох",
                    sender="52",
                    created_at="2026-01-31T21:35:10.161344"
                )
            ]
        )