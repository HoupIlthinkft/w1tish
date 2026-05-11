from pymongo.asynchronous.database import AsyncDatabase
from backend.models import MessagesResponse, MessageModel
from backend.errors import InvalidMessagesError
from pydantic import ValidationError
from datetime import datetime, timedelta

from backend.core.config import settings
from pydantic import BaseModel

from logging import getLogger
logger = getLogger(__name__)

class MessagesRepository:
    def __init__(self, mb: AsyncDatabase): self.mb = mb["messages"]

    async def add_message(
        self,
        message: BaseModel
    ) -> None:
        try:
            await self.mb.insert_one(message.model_dump())

        except TypeError as e:
            logger.error("Error occured: ", exc_info=e)
            raise InvalidMessagesError()
        
        except ValidationError as e:
            raise InvalidMessagesError(e.title)
        
    async def get_undelivered_messages(self, reciver: str) -> MessagesResponse:
        messages = await self.mb.find(
            {"reciver": reciver}
        ).to_list()
        return MessagesResponse.model_validate({"messages": messages})
    
    async def delived(self, ids: list[str]) -> None:
        await self.mb.delete_many({"_id": {"$in": ids}})
        
    async def get_messages_by_chat(
            self,
            chat_id: str,
            limit: int,
            offset: int
    ) -> MessagesResponse:
        messages = await self.mb.find(
            {"chat_id": chat_id}
        ).sort("_id", -1).skip(offset).limit(limit).to_list(length=limit)
        messages.reverse()
        return MessagesResponse.model_validate({"messages": messages})
    

    
class BlacklistRepository:
    def __init__(self, mb: AsyncDatabase): self.mb = mb["tokens"]

    async def unvalidate_token(self, token: str, live_time: int = settings.REFRESH_TOKEN_MAX_AGE) -> None:
        await self.mb.insert_one({"token": token, "expireAt": datetime.now() + timedelta(seconds=live_time)})

    async def check_blacklist(self, token: str) -> bool:
        token = await self.mb.find({"token": token}).to_list()
        if token: return True
        return False