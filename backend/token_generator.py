from asyncio import get_running_loop
from functools import wraps
from cryptography.fernet import Fernet, InvalidToken
from os import getenv
from json import loads, dumps, JSONDecodeError
from errors import InvalidTokenError
from concurrent.futures import ProcessPoolExecutor
from datetime import datetime



cipher = Fernet(getenv("JWT_SECRET", "error"))
_executor = ProcessPoolExecutor()


async def create_tokens(userid: int) -> dict:
    loop = get_running_loop()
    return await loop.run_in_executor(
        _executor,
        generate_tokens,
        userid
    )


async def refresh_tokens(refresh_token: str) -> dict | None:
    loop = get_running_loop()
    try:
        decrypted_token = await loop.run_in_executor(
            _executor,
            cipher.decrypt,
            refresh_token
        )
        decrypted_token = loads(decrypted_token)

    except (JSONDecodeError, InvalidToken):
        raise InvalidTokenError()
    
    return await loop.run_in_executor(
        _executor,
        generate_tokens,
        decrypted_token.get("userid")
    )


async def validate_token(token: str) -> int | None:
    loop = get_running_loop()
    try:
        decrypted_token = await loop.run_in_executor(
            _executor,
            cipher.decrypt,
            token
        )
        decrypted_token = loads(decrypted_token)

    except (JSONDecodeError, InvalidToken):
        raise InvalidTokenError()
    
    if decrypted_token.get("expires_at") < int(datetime.now().timestamp()):
        return None
    
    return decrypted_token.get("userid")


def generate_tokens(id):
    now_time = int(datetime.now().timestamp())
    
    raw_access_token = {
        "userid": id,
        "expires_at": now_time + 900 # 15 минут
    }
    access_token = cipher.encrypt(dumps(raw_access_token).encode())

    raw_refresh_token = {
        "userid": id,
        "expires_at": now_time + 604800 # 7 дней
    }
    refresh_token = cipher.encrypt(dumps(raw_refresh_token).encode())

    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }
