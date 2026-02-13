import struct
import os, time
import asyncio
import hashlib
from datetime import datetime
from backend.core.config import settings

class SnowflakeIdGenerator:
    def __init__(self):
        self.server = settings.SERVER_ID
        self.worker = (os.getpid() % 32) & 0x1F

        self._seq = 0
        self._last_time = time.perf_counter_ns() // 1_000_000
        self._lock = asyncio.Lock()

    async def _get_increment(self):
        async with self._lock:
            now = time.perf_counter_ns() // 1_000_000
            if self._seq >= 4095:
                while now <= self._last_time:
                    await asyncio.sleep(0) # отдаем управление
                    now = time.perf_counter_ns() // 1_000_000

                self._seq = 0
                self._last_time = time.perf_counter_ns() // 1_000_000
            else:
                if now > self._last_time:
                    self._seq = 0
                    self._last_time = now
                else:
                    self._seq += 1
            
            return self._seq

    async def generate_userid(self):
        time_mark = round(datetime.now().timestamp() * 1000) - settings.APP_EPOCH
        counter = await self._get_increment()
        user_id = (
            (time_mark << 22) | (self.server << 17) | (self.worker << 12) | counter
        )
        return user_id
    
    def generate_chatid(self, users: list[int]):
        users.sort()    # не критично если изменим оригинал
        hash_64 = int(
            hashlib.blake2b(
                struct.pack(f">{len(users)}Q", *users),
                digest_size=8).hexdigest(),

            base=16
        ) & 0xFFFF_FFFF_FFFF_FFF
        return hash_64