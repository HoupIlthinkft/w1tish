from fastapi import Depends, FastAPI
from typing import Annotated

from backend.utils import services
from backend.utils.security import id_generator
from backend.dependencies import annotations
from backend import repositories as repo
from backend.utils.cloud import s3_lifespan
from backend.core.engine import bases_lifespan
from backend.core.config import settings

from concurrent.futures import ThreadPoolExecutor
from backend.utils.websocket import WebSocketManager

from contextlib import asynccontextmanager, AsyncExitStack
from logging import getLogger
logger = getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.executor = ThreadPoolExecutor(
        max_workers=settings.WORKERS_COUNT
    )
    app.state.generator = id_generator.SnowflakeIdGenerator()
    async with AsyncExitStack() as stack:
        await stack.enter_async_context(bases_lifespan(app))
        await stack.enter_async_context(s3_lifespan(app))
        app.state.manager = WebSocketManager(app, repo.ChatRepository, repo.MessagesRepository)
        await stack.enter_async_context(app.state.manager.lifespan())
        yield

def get_auth_service(
    session: annotations.Database,
    collection: annotations.MessageBase,
    encrypter: annotations.PasswordEncrypter,
    avatars_repo: annotations.AvatarLoader,
    id_generator: annotations.IdGenerator
) -> services.AuthService:
    blacklist_repo = repo.BlacklistRepository(collection)
    auth_repo = repo.AuthRepository(session, encrypter, id_generator)
    return services.AuthService(auth_repo, blacklist_repo, avatars_repo)

def get_data_service(
    session: annotations.Database,
    collection: annotations.MessageBase,
    avatar_loader: annotations.AvatarLoader,
    id_generator: annotations.IdGenerator,
    sock_manager: annotations.SockManager
) -> services.DataService:
    data_repo = repo.DataRepository(session)
    keys_repo = repo.KeysRepository(session)
    chats_repo = repo.ChatRepository(session, id_generator)
    mess_repo = repo.MessagesRepository(collection)
    return services.DataService(
        data_repo,
        chats_repo,
        mess_repo,
        avatar_loader,
        sock_manager,
        keys_repo
    )

AuthServiceDep = Annotated[services.AuthService, Depends(get_auth_service)]
DataServiceDep = Annotated[services.DataService, Depends(get_data_service)]
WebSocketDep = Annotated[WebSocketManager, Depends(annotations.get_websocket_manager)]