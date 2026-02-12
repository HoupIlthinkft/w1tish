class BaseAppException(Exception): ...

class NoCommitException(Exception): ...

class UserExistError(NoCommitException): ...

class UserNotFoundError(NoCommitException): ...

class ChatNotFoundError(NoCommitException): ...

class ChatExistError(NoCommitException): ...

class WrongPasswordError(BaseAppException): ...

class InvalidTokenError(BaseAppException): ...

class InvalidMessagesError(BaseAppException): ...

class InvalidImageError(BaseAppException): ...

class ExpiredTokenError(BaseAppException): ...

class NoPermissionError(BaseAppException): ...

class NoReadPermissionError(BaseAppException): ...

class NoWritePermissionError(BaseAppException):
    def __init__(self, message: dict):
        super().__init__()
        self.error_message = message

class InvalidArgumentsError(BaseAppException):
    def __init__(self, message: str):
        super().__init__()
        self.message = message

class TooLongError(BaseAppException):
    def __init__(self, message):
        super().__init__()
        self.message = message

class TooBigFileError(BaseAppException):
    def __init__(self, max_size: int):
        super().__init__()
        if max_size < 1024:
            self.max_size = str(max_size) + "b"
        elif max_size < 1024**2:
            self.max_size = str(max_size / 1024) + "Kb"
        elif max_size < 1024**3:
            self.max_size = str(max_size / 1024**2) + "Mb"
        else:
            self.max_size = str(max_size / 1024**3) + "Gb"