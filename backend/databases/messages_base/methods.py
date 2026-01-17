from pymongo.collection import Collection
from errors import InvalidMessagesError

async def add_messages(messages: list[dict], collection: Collection) -> None:
    if not all("chat_id" in message and "content" in message and "created_at" in message for message in messages):
        raise InvalidMessagesError()
    
    try:
        await collection.insert_many(messages)
    except TypeError:
        raise InvalidMessagesError()
    
async def get_messages_by_chat(
        chat_id: str,
        collection: Collection,
        limit: int = 50,
        offset: int = 0
    ) -> list[dict]:
    return await collection.find({"chat_id": chat_id}, {"_id": 0}).skip(offset).limit(limit).to_list(length=limit)
