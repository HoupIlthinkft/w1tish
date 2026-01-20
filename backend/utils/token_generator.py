from asyncio import get_running_loop
import jwt
from os import getenv
from backend.errors import InvalidTokenError, ExpiredTokenError
from concurrent.futures import ProcessPoolExecutor
import datetime



secret = getenv("JWT_SECRET", "error")
algorithm = "HS256"
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
    decrypted_token = await loop.run_in_executor(
        _executor,
        decrypt_token,
        refresh_token
    )
    
    return await loop.run_in_executor(
        _executor,
        generate_tokens,
        decrypted_token.get("id")
    )


async def get_userid_by_token(token: str) -> int | None:
    loop = get_running_loop()
    decrypted_token = await loop.run_in_executor(
        _executor,
        decrypt_token,
        token
    )
    
    return decrypted_token.get("id")


def generate_tokens(id, access_time: int = 900, refresh_time: int = 604800):
    
    payload = {
        "id": id,
        "t": "a",
        "exp": datetime.timedelta(seconds=access_time) + datetime.datetime.now(datetime.timezone.utc)
    }
    access_token = jwt.encode(payload, secret, algorithm)

    payload = {
        "id": id,
        "t": "r",
        "exp": datetime.timedelta(seconds=refresh_time) + datetime.datetime.now(datetime.timezone.utc)
    }
    refresh_token = jwt.encode(payload, secret, algorithm)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }

def decrypt_token(token):
    try:
        data = jwt.decode(token, secret, algorithms=[algorithm])
        return data
    except jwt.ExpiredSignatureError:
        raise ExpiredTokenError()
    except jwt.InvalidTokenError:
        raise InvalidTokenError()
