from fastapi import APIRouter, Depends, status, Security, Query, UploadFile, File
from fastapi.security import HTTPBearer

from backend.dependencies.dependencies import DataServiceDep
from typing import Annotated
from backend.utils.security.token_generator import get_id_by_jwt
from backend import models
from backend.core.config import config

import logging
logger = logging.getLogger(__name__)

http_bearer = HTTPBearer(auto_error=True)
def get_userid_from_bearer(token: str = Security(http_bearer)):
    return get_id_by_jwt(token.credentials)

CurrentUser = Annotated[int, Depends(get_userid_from_bearer)]
data_router = APIRouter(prefix="/web/data", tags=["Data методы"])

@data_router.get(
    "/user",
    response_model=models.UsersResponse,
    summary=config.docs.user.summary,
    description=config.docs.user.description,
    responses=config.docs.user.responses
)
async def get_user_data_by_id(
    service: DataServiceDep,
    user_id: Annotated[list[int], Query(description="Айди пользователя")] = None,
    username: Annotated[list[str], Query(description="Логин пользователя")] = None
):
    logger.info("[GET] Trying get some users data...")
    return await service.get_users_data(user_id, username)


@data_router.get(
    "",
    response_model=models.UserResponse,
    summary=config.docs.data.summary,
    description=config.docs.data.description,
    responses=config.docs.data.responses
)
async def get_self_data(service: DataServiceDep, user_id: CurrentUser):
    logger.info("[GET] Trying get user data...")
    return await service.get_user_data(user_id)


@data_router.post(
    "/messages",
    status_code=status.HTTP_201_CREATED,
    response_model=models.OKResponse,
    summary=config.docs.add_messages.summary,
    description=config.docs.add_messages.description,
    responses=config.docs.add_messages.responses
)
async def add_new_message(
    request: models.MessageModel,
    service: DataServiceDep,
    user_id: CurrentUser
):
    logger.info("[POST] Trying to add new message...")
    await service.add_message(user_id, request)
    return models.OKResponse()

@data_router.get(
    "/messages",
    response_model=models.MessagesResponse,
    summary=config.docs.get_messages.summary,
    description=config.docs.get_messages.description,
    responses=config.docs.get_messages.responses
)
async def get_messages(
    service: DataServiceDep,
    user_id: CurrentUser,
    chat_id: str,
    offset: Annotated[int, Query(ge=0, description="Смещение относительно последнего сообщения")] = 0,
    limit: Annotated[int, Query(le=100, description="Колличество сообщений")] = 50
):
    logger.info("[GET] Trying get messages...")
    messages = await service.get_messages(user_id, chat_id, offset, limit)
    return messages

@data_router.post(
    "/chats",
    status_code=status.HTTP_201_CREATED,
    response_model=models.CreateChatResponse,
    summary=config.docs.chats.summary,
    description=config.docs.chats.description,
    responses=config.docs.chats.responses
)
async def create_new_chat(
    request: models.CreateChatRequestModel,
    service: DataServiceDep,
    user_id: CurrentUser
):  
    logger.info("[POST] Trying to create chat...")
    chat_id = await service.add_chat(user_id, request)
    return models.CreateChatResponse(chat_id=chat_id)

@data_router.patch(
    "/avatar",
    response_model=models.OKResponse,
    summary=config.docs.avatar.summary,
    description=config.docs.avatar.description,
    responses=config.docs.avatar.responses
)
async def set_avatar(
    service: DataServiceDep,
    user_id: CurrentUser,
    file: UploadFile = File(..., description="Новый аватар пользователя")
):
    # TODO сделать проверку типа поступаемого изображения
    logger.info("[PATCH] Trying to upload avatar...")
    await service.set_avatar(file.file, user_id)
    return models.OKResponse()

@data_router.patch(
    "/nickname",
    response_model=models.OKResponse,
    summary=config.docs.nickname.summary,
    description=config.docs.nickname.description,
    responses=config.docs.nickname.responses
)
async def set_user_nickname(
    service: DataServiceDep,
    user_id: CurrentUser,
    nickname: models.SetNicknameModel
):
    logger.info(f"[PATCH] Trying to update nickname... '{nickname.nickname}'")
    await service.set_nickname(nickname.nickname, user_id)
    return models.OKResponse()

# TODO добавить доставку сообщений в реальном времени через WebSocket