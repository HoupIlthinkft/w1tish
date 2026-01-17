from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware

from databases.data_base.engine import get_async_db
from databases.messages_base.engine import get_messages_collection

from databases.data_base.auth_methods import register_new, auth_user
from databases.data_base.data_methods import get_user_data
from databases.messages_base.methods import add_messages, get_messages_by_chat

from utils.token_generator import create_tokens, refresh_tokens, validate_token

from models import (
    AuthRequest,
    RegisterRequest,
    ResponseData,
    RefreshTokens
)

from errors import (
    UserExistError,
    UserNotFoundError,
    WrongPasswordError,
    InvalidTokenError,
    InvalidMessagesError
)



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # для тестирования разрешаем все источники
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/auth")
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
    

@app.post("/register")
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


@app.post("/user/data")
async def get_user_data_by_token(token: ResponseData, db = Depends(get_async_db)):
    try:
        is_token_valid = await validate_token(token.token)
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Invalid access token"
        )
    if is_token_valid is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token expired"
        )
    else:
        return await get_user_data(is_token_valid, db)
        

@app.post("/update_token")
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
    

@app.post("/messages/add")
async def add_new_messages(messages: list[dict], collection = Depends(get_messages_collection)):
    try:
        await add_messages(messages, collection)
    except InvalidMessagesError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Invalid messages format"
        )
    return {"detail": "Messages added successfully"}

@app.get("/messages/{chat_id}")
async def get_messages(
    chat_id: str,
    limit: int = 50,
    offset: int = 0,
    collection = Depends(get_messages_collection)
):
    messages = await get_messages_by_chat(chat_id, collection, limit, offset)
    return {"messages": messages}