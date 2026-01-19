from fastapi import APIRouter, HTTPException, Depends, status
from backend.databases.data_base.engine import get_async_db
from backend.databases.data_base.auth_methods import register_new, auth_user
from backend.utils.token_generator import create_tokens, refresh_tokens

from backend.models import (
    AuthRequest,
    RegisterRequest,
    RefreshTokens
)

from backend.errors import (
    UserExistError,
    UserNotFoundError,
    WrongPasswordError,
    InvalidTokenError
)

print("creating router...")
auth_router = APIRouter(prefix="/api")

@auth_router.post("/auth")
async def authentificate(auth_request: AuthRequest, db = Depends(get_async_db)):
    try:
        user = await auth_user(auth_request.username, auth_request.password, db)
    except UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    except WrongPasswordError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong password or login"
        )
    if user:
        return await create_tokens(user.id)
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Iternal server error"
        )
    

@auth_router.post("/register")
async def register(register_request: RegisterRequest, db = Depends(get_async_db)):
    try:
        user_id = await register_new(
            register_request.username,
            register_request.email,
            register_request.password,
            db
        )
    except UserExistError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists"
        )
    
    if user_id:
        return await create_tokens(user_id)
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
        

@auth_router.post("/update_token")
async def update_token(token: RefreshTokens):
    try:
        is_token_valid = await refresh_tokens(token.token)
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Invalid refresh token"
        )
    if is_token_valid is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired"
        )
    else:
        return await refresh_tokens(token.token)
    