from pymongo.asynchronous.database import AsyncDatabase
from backend.models import MessagesResponse, MessageModel
from backend.errors import InvalidMessagesError
from pydantic import ValidationError
from datetime import datetime, timedelta

from backend.core.config import settings

from logging import getLogger
logger = getLogger(__name__)

class MessagesRepository:
    def __init__(self, mb: AsyncDatabase): self.mb = mb["messages"]

    async def add_message(
        self,
        message: MessageModel
    ) -> None:
        try:
            await self.mb.insert_one(message.model_dump())

        except TypeError as e:
            logger.error("Error occured: ", exc_info=e)
            raise InvalidMessagesError()
        
        except ValidationError as e:
            raise InvalidMessagesError(e.title)
        
        
    async def get_messages_by_chat(
            self,
            chat_id: str,
            limit: int,
            offset: int
    ) -> MessagesResponse:
        messages = await self.mb.find(
            {"chat_id": chat_id},
            {"_id": 0}
        ).skip(offset).limit(limit).to_list(length=limit)
        return MessagesResponse.model_validate({"messages": messages})
    
class BlacklistRepository:
    def __init__(self, mb: AsyncDatabase): self.mb = mb["tokens"]

    async def unvalidate_token(self, token: str, live_time: int = settings.REFRESH_TOKEN_MAX_AGE) -> None:
        await self.mb.insert_one({"token": token, "expireAt": datetime.now() + timedelta(seconds=live_time)})

    async def check_blacklist(self, token: str) -> bool:
        token = await self.mb.find({"token": token}).to_list()
        if token: return True
        return False