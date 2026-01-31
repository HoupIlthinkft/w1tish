from fastapi import Depends, FastAPI
from typing import Annotated

from backend.utils import services
from backend.dependencies import annotations
from backend import repositories as repo
from backend.utils.cloud import s3_lifespan
from backend.core.engine import bases_lifespan
from backend.core.config import settings

from concurrent.futures import ThreadPoolExecutor

from contextlib import asynccontextmanager, AsyncExitStack


# TODO добавить фабрики для репозиториев

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.executor = ThreadPoolExecutor(
        max_workers=settings.WORKERS_COUNT
    )
    async with AsyncExitStack() as stack:
        await stack.enter_async_context(bases_lifespan(app))
        await stack.enter_async_context(s3_lifespan(app))
        yield

def get_auth_service(
    session: annotations.Database,
    collection: annotations.MessageBase,
    encrypter: annotations.PasswordEncrypter,
    avatars_repo: annotations.AvatarLoader
) -> services.AuthService:
    blacklist_repo = repo.BlacklistRepository(collection)
    auth_repo = repo.AuthRepository(session, encrypter)
    return services.AuthService(auth_repo, blacklist_repo, avatars_repo)

def get_data_service(
    session: annotations.Database,
    collection: annotations.MessageBase,
    avatar_loader: annotations.AvatarLoader
) -> services.DataService:
    data_repo = repo.DataRepository(session)
    chats_repo = repo.ChatRepository(session)
    mess_repo = repo.MessagesRepository(collection)
    return services.DataService(
        data_repo,
        chats_repo,
        mess_repo,
        avatar_loader
    )

AuthServiceDep = Annotated[services.AuthService, Depends(get_auth_service)]
DataServiceDep = Annotated[services.DataService, Depends(get_data_service)]