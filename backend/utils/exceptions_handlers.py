from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
import backend.errors as err

import logging
logger = logging.getLogger(__name__)

def keys_exist_handler(
    request: Request,
    exc: err.KeysExistError
):
    logger.warning("Attemp to replace keys using keys/public [POST]")
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content = {
            "detail": "Keys for this user already exists. Use keys/signed, keys/identity or keys/pre"
        }
    )

def chat_exist_handler(
    request: Request,
    exc: err.ChatExistError
):
    logger.warning("Attemp to replace chat")
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content = {
            "detail": "Chat already exist! Use websockets to message..."
        }
    )

def invalid_argument_handler(
    request: Request,
    exc: err.InvalidArgumentsError
):
    logger.warning(exc.message)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content = {
            "detail": exc.message
        }
    )

def invalid_image_handler(
    request: Request,
    exc: err.InvalidImageError
):
    logger.warning("Invalid image")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content = {
            "detail": "Invalid image signature"
        }
    )


def user_exist_handler(
    request: Request,
    exc: err.UserExistError
):
    logger.warning("User already exist")
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content = {
            "detail": "User already exists"
        }
    )


def user_not_found_handler(
    request: Request,
    exc: err.UserNotFoundError
):
    logger.warning("User not exist")
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content = {
            "detail": "User not exists"
        }
    )

def chat_not_found_handler(
    request: Request,
    exc: err.NoWritePermissionError
):
    logger.warning("Chat not found")
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content = {
            "detail": "Chat not exists"
        }
    )


def wrong_password_handler(
    request: Request,
    exc: err.WrongPasswordError
):
    logger.warning("Wrong password")
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content = {
            "delail": "Wrong password or login"
        }
    )


def invalid_token_handler(
    request: Request,
    exc: err.InvalidTokenError
):
    logger.warning("Invalid token")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content = {
            "detail": "Invalid token"
        }
    )


def invalid_messages_handler(
    request: Request, 
    exc: err.InvalidMessagesError
):
    logger.warning("Invalid message format")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content = {
            "detail": "Invalid messages format"
        }
    )


def expired_token_handlers(
    request: Request,
    exc: err.ExpiredTokenError
):
    logger.warning("Token expired")
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content = {
            "detail": "Token expired"
        }
    )


def no_write_permission_handlers(
    request: Request,
    exc: err.NoWritePermissionError
):
    logger.warning("No write permissions")
    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN,
        content = {
            "detail": "Has no permissions to write"
        }
    )


def no_read_permission_handlers(
    request: Request,
    exc: err.NoReadPermissionError
):
    logger.warning("No read permissions")
    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN,
        content = {
            "detail": "Has no permissions to read"
        }
    )

def too_big_file_handlers(
    request: Request,
    exc: err.TooBigFileError
):
    logger.warning("Too big file")
    return JSONResponse(
        status_code=status.HTTP_413_CONTENT_TOO_LARGE,
        content = {
            "detail": f"Max file size is {exc.max_size}",
            "max_size": exc.max_size
        }
    )

def too_long_nickname_handlers(
    request: Request,
    exc: err.TooLongError
):
    logger.info("Too long nickname")
    return JSONResponse(
        status_code=status.HTTP_413_CONTENT_TOO_LARGE,
        content = {
            "detail": exc.message
        }
    )

HANDLERS = {
    err.KeysExistError:         keys_exist_handler,
    err.ChatExistError:         chat_exist_handler,
    err.InvalidArgumentsError:  invalid_argument_handler,
    err.InvalidImageError:      invalid_image_handler,
    err.UserExistError:         user_exist_handler,
    err.UserNotFoundError:      user_not_found_handler,
    err.ChatNotFoundError:      chat_not_found_handler,
    err.WrongPasswordError:     wrong_password_handler,
    err.InvalidTokenError:      invalid_token_handler,
    err.InvalidMessagesError:   invalid_messages_handler,
    err.ExpiredTokenError:      expired_token_handlers,
    err.NoWritePermissionError: no_write_permission_handlers,
    err.NoReadPermissionError:  no_read_permission_handlers,
    err.TooBigFileError:        too_big_file_handlers,
    err.TooLongError:           too_long_nickname_handlers
}

def setup_exception_handlers(app: FastAPI):
    for exc_class, handler in HANDLERS.items():
        app.add_exception_handler(exc_class, handler)

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Type: {type(exc).__name__}", exc_info=exc)
        return JSONResponse(
            status_code=500,
            content={"detail": f"Type: {type(exc).__name__}, Message: {str(exc)}"}
        )
