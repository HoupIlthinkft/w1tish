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

CurrentUser = Annotated[str, Depends(get_userid_from_bearer)]
encrypt_router = APIRouter(prefix="/web/keys", tags=["Методы шифрования"])

@encrypt_router.get(
    "",
    response_model=models.UserKeysResponse,
)
async def get_user_keys(
    service: DataServiceDep,
    user_id: Annotated[str, Query(description="Айди пользователя")]
):
    logger.info("[GET] Trying get user keys...")
    return await service.get_user_keys(user_id)

@encrypt_router.post(
    "/public",
    response_model=models.OKResponse
)
async def set_user_keys(
    service: DataServiceDep,
    user_id: CurrentUser,
    keys: models.SetAllKeysRequestModel
):
    logger.info("[POST] Setting user keys...")
    await service.set_user_keys(user_id, keys)
    return models.OKResponse()