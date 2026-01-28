from typing import Annotated
from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from pymongo.asynchronous.database import AsyncDatabase
from typing import AsyncGenerator

async def get_async_db(request: Request) -> AsyncGenerator[AsyncSession, None]:
    async with request.app.state.pg_session() as session:
        yield session

def get_messages_session(request: Request) -> AsyncDatabase:
    return request.app.state.mg_session

Database = Annotated[AsyncSession, Depends(get_async_db)]
MessageBase = Annotated[AsyncDatabase, Depends(get_messages_session)]
