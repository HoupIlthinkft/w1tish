from backend.interfaces import protocols
from backend import errors as err

class AuthMock(protocols.IAuthRepository):

    async def auth_user(self, username, password):
        if username == password: raise err.UserNotFoundError()
        return 52
    
    async def register_new(self, username, email, password):
        if username == email: raise err.UserExistError()
        return 52


class BlackListMock(protocols.IBlacklistRepository):

    def __init__(self):
        self.blacklist = set()

    async def check_blacklist(self, token):
        return token in self.blacklist
    
    async def unvalidate_token(self, token, live_time):
        self.blacklist.add(token)


class AvatarMock(protocols.IAvatarLoader):

    async def load_avatar(self, avatar, user_id): ...

    async def set_default_avatar(self, user_id): ...