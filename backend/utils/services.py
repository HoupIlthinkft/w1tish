from backend import models
from backend import errors as err
from backend.utils.security import token_generator
from backend.interfaces import protocols
from typing import BinaryIO
from backend.core.config import settings, config

from logging import getLogger
logger = getLogger(__name__)

class AuthService:
    def __init__(
        self,
        auth_repo: protocols.IAuthRepository,
        blacklist: protocols.IBlacklistRepository,
        avatars_repo: protocols.IAvatarLoader
    ):
        self.auth_repo = auth_repo
        self.blacklist = blacklist
        self.user_avatars = avatars_repo
    
    async def auth_user(self, request: models.AuthRequestModel) -> models.TokensResponse:
        user_id = await self.auth_repo.auth_user(
            request.username,
            request.password
        )
        tokens = token_generator.generate_tokens(user_id)
        return tokens
    
    async def register_user(self, request: models.RegisterRequestModel) -> models.TokensResponse:
        user_id = await self.auth_repo.register_new(
            request.username,
            request.email,
            request.password
        )
        await self.user_avatars.set_default_avatar(user_id)
        tokens = token_generator.generate_tokens(user_id)
        return tokens
    
    async def update_auth_session(self, token: str) -> models.TokensResponse:
        if await self.blacklist.check_blacklist(token):
            raise err.InvalidTokenError
        await self.blacklist.unvalidate_token(token)
        tokens = token_generator.refresh_tokens(token)
        return tokens


class DataService:
    def __init__(
        self,
        data_repo: protocols.IDataRepository,
        chats_repo: protocols.IChatRepository,
        mess_repo: protocols.IMessagesRepository,
        avatars_repo: protocols.IAvatarLoader,
        sock_manager: protocols.ISockManager,
        keys_repo: protocols.IKeyRepository
    ):
        self.user_data = data_repo
        self.user_chats = chats_repo
        self.user_messages = mess_repo
        self.user_avatars = avatars_repo
        self.sock_manager = sock_manager
        self.user_keys = keys_repo

    async def get_user_keys(self, user_id: str) -> models.UserKeysResponse:
        pre_key = None
        try: pre_key = await self.user_keys.get_prekey(user_id)
        except err.NoPreKeysError: logger.info("Set prekey to None")

        public_keys = await self.user_keys.get_user_keys(user_id)
        public_keys.pre_key = pre_key

        return public_keys
    
    async def set_user_keys(self, user_id: str, keys: models.SetAllKeysRequestModel) -> None:
        await self.user_keys.add_public_keys(user_id, keys.identity_key, keys.signed_key, keys.signature)
        self.user_keys.add_prekeys(user_id, keys.pre_keys)

    async def first_message(self, user_id: str, request: models.FirstMessageModel) -> str:
        if user_id != request.sender: 
            raise err.NoWritePermissionError("Cant send message from another user!")
        
        permissions = {request.sender: "member", request.reciver: "member"}
        chat_id = await self.user_chats.add_chat(permissions)
        message = models.MessageModel(
            type=request.type,
            chat_id=chat_id,
            content=request.content,
            sender=request.sender,
            reciver=request.reciver
        )
        await self.user_messages.add_message(message)
        return chat_id
    

    
    # =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    async def add_chat(self, user_id: int, request: models.CreateChatRequestModel) -> str:
        chat_members = []
        for chat_user_id in request.members_ids:
            chat_members.append(chat_user_id)
        await self.user_data.get_users_by_ids(chat_members)
        
        permissions = {str(member): "user" for member in request.members_ids}
        permissions[str(user_id)] = "owner"
        if len(permissions) != 2: raise err.InvalidArgumentsError("You should create chat with 2 users")

        chat_id = await self.user_chats.add_chat(permissions)
        await self.sock_manager.new_chat(models.ChatModel(id=chat_id, permissions=permissions))
        return chat_id
    
    # =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=



    async def get_messages(self, user_id: str, chat_id: str, offset: int, limit: int) -> models.MessagesResponse:
        avarible_chats = await self.user_chats.get_user_chats(user_id)
        if chat_id in avarible_chats:
            messages = await self.user_messages.get_messages_by_chat(
                chat_id,
                limit,
                offset
            )
            return messages
        raise err.NoReadPermissionError()

    async def get_user_data(self, user_id: int) -> models.UserResponse:
        data = await self.user_data.get_user_data(user_id)
        return data
    
    async def get_users_data(
            self,
            users_ids: list[int] = None,
            users_usernames: list[str] = None
    ) -> models.UsersResponse:
        if users_ids and users_usernames: raise err.InvalidArgumentsError("Too many arguments. Select usernames or ids")

        if users_ids:
            data = await self.user_data.get_users_by_ids(users_ids)
            return data
        
        elif users_usernames:
            data = await self.user_data.get_users_by_usernames(users_usernames)
            return data
        
        raise err.InvalidArgumentsError("Noone argument was getted")
        
    async def set_avatar(self, file: BinaryIO, user_id: int) -> None:
        avatar_bytes = file.read(settings.MAX_AVATAR)
        if file.read(1):
            raise err.TooBigFileError(max_size=settings.MAX_AVATAR)
        
        await self.user_avatars.load_avatar(avatar_bytes, user_id)

    async def set_nickname(self, nickname: str, user_id: int) -> None:
        if len(nickname) > config.limits.nickname_len:
            raise err.TooLongError(f"Max nickname len is {config.limits.nickname_len}")
        
        await self.user_data.set_user_nickname(nickname, user_id)