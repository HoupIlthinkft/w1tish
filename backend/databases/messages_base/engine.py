from pymongo.collection import Collection
from pymongo import AsyncMongoClient
from os import getenv

USER = getenv("MONGO_USER", "admin")
PASSWORD = getenv("MONGO_PASS", "password")
HOST = getenv("MONGO_HOST", "mongodb")

DB_NAME = getenv("MONGO_DB_NAME", "messages_db")

URL = f"mongodb://{USER}:{PASSWORD}@{HOST}:27017"

_session = None

async def get_messages_collection() -> Collection:
    global _session
    if _session is None:
        _session = AsyncMongoClient(URL)
        _collection = _session[DB_NAME]["messages"]
        
        await _collection.create_index([("chat_id", 1)], name="idx_chat_id")
        await _collection.create_index([("created_at", -1)], name="idx_created_at")

    return _session[DB_NAME]["messages"]