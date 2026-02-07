from fastapi import APIRouter, WebSocket, status, WebSocketException
from backend.utils.security.token_generator import get_id_by_jwt
from backend.dependencies.dependencies import WebSocketDep
from backend import errors as err
from logging import getLogger
logger = getLogger(__name__)

socket_router = APIRouter()

@socket_router.websocket("/ws")
async def connect_broadcast(
    websocket: WebSocket,
    token: str,
    manager: WebSocketDep
):
    try:
        user_id = get_id_by_jwt(token)

    except (err.InvalidTokenError, err.ExpiredTokenError):
        raise WebSocketException(status.WS_1008_POLICY_VIOLATION)
    
    await manager.connect(websocket, user_id)
    logger.info("Exiting router...")