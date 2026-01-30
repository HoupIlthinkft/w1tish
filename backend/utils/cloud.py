import aioboto3
from fastapi import FastAPI
from backend.core.config import settings
from contextlib import asynccontextmanager
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from PIL import Image, ImageOps
import asyncio

from logging import getLogger
logger = getLogger(__name__)

ACCESS_KEY = settings.S3_ACCESS
SECRET_KEY = settings.S3_SECRET
ENDPOINT = settings.S3_ENDPOINT
AVATARS_ENDPOINT = settings.S3_AVATARS
BUCKET_NAME = settings.S3_BUKKET

@asynccontextmanager
async def s3_lifespan(app: FastAPI):
    logger.info("Creating s3 session...")
    _s3_session = aioboto3.Session(
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY
    )
    async with _s3_session.client("s3", endpoint_url=settings.S3_ENDPOINT) as client:
        app.state.s3_client = client
        yield


class AvatarLoaderRepository:
    def __init__(self, executor: ThreadPoolExecutor, s3_client):
        self.s3_client = s3_client
        self.bukket = settings.S3_BUKKET
        self.executor = executor

    def _sync_resize_avatar(self, avatar_file: bytes) -> bytes:
        with Image.open(BytesIO(avatar_file)) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')

            img = ImageOps.fit(img, (256, 256), Image.Resampling.LANCZOS)
        
            out_buffer = BytesIO()
            img.save(out_buffer, format="JPEG", quality=85, optimize=True)
            return out_buffer.getvalue()
        
    async def _resize_avatar(self, avatar_file: bytes) -> bytes:
        loop = asyncio.get_event_loop()
        avatar_bytes = await loop.run_in_executor(
            self.executor,
            self._sync_resize_avatar,
            avatar_file
        )
        return avatar_bytes
            

    async def _upload_avatar(self, avatar_file: bytes, user_id: int):
        await self.s3_client.put_object(
            Bucket=self.bukket,
            Key=f"/avatars/{user_id}.jpeg",
            Body=avatar_file,
            ContentType="image/jpeg"
        )

    async def load_avatar(self, avatar: bytes, user_id: int) -> str:
        resized_bytes = await self._resize_avatar(avatar)
        await self._upload_avatar(resized_bytes, user_id)
        url = AVATARS_ENDPOINT + f"/avatars/{user_id}.jpeg"
        logger.info(url)
        return url