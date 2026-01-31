from fastapi import APIRouter, status, Cookie, Response
from typing import Annotated

from backend.core.config import settings, config
from backend.dependencies.dependencies import AuthServiceDep
from backend.models import (
    AuthRequestModel,
    RegisterRequestModel,
    AccessTokenResponse
)

import logging
logger = logging.getLogger(__name__)

def _set_refresh_cookie(response: Response, refresh_token) -> None:
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite=settings.COOKIE_SAMESITE,
            path="/web/auth/session",
            max_age=settings.REFRESH_TOKEN_MAX_AGE
        )


auth_router = APIRouter(prefix="/web/auth", tags=["Auth"])

@auth_router.post(
    "",
    response_model=AccessTokenResponse,
    summary=config.docs.auth.summary
)
async def authenticate(
    auth_request: AuthRequestModel,
    auth_service: AuthServiceDep,
    response: Response
):  
    logger.info("[POST] Trying authenticate user...")
    tokens = await auth_service.auth_user(auth_request)
    _set_refresh_cookie(response, tokens.refresh_token)

    return {
          "access_token": tokens.access_token
    }
    

@auth_router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=AccessTokenResponse,
    summary=config.docs.register.summary
)
async def register(
    register_request: RegisterRequestModel,
    auth_service: AuthServiceDep,
    response: Response
): 
    logger.info("[POST] Trying register user...")
    tokens = await auth_service.register_user(register_request)
    _set_refresh_cookie(response, tokens.refresh_token)

    return {
          "access_token": tokens.access_token
    }
        

@auth_router.post(
    "/session/refresh",
    response_model=AccessTokenResponse,
    summary=config.docs.refresh.summary
)
async def update_token(
    auth_service: AuthServiceDep,
    response: Response,
    refresh_token: Annotated[str | None, Cookie()] = None
):  
    logger.info("[POST] Trying refresh token...")
    tokens = await auth_service.update_auth_session(refresh_token)
    _set_refresh_cookie(response, tokens.refresh_token)

    return {
          "access_token": tokens.access_token
    }


@auth_router.post(
    "/session/logout",
    status_code=status.HTTP_200_OK,
    summary=config.docs.logout.summary
)
async def reset_token(
    auth_service: AuthServiceDep,
    response: Response,
    refresh_token: Annotated[str | None, Cookie()] = None
):
    logger.info("[POST] Trying delete token...")
    response.delete_cookie(key="refresh_token", path="/auth/session")
    await auth_service.blacklist.unvalidate_token(refresh_token)