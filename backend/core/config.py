from pydantic_settings import BaseSettings, SettingsConfigDict
from datetime import datetime

class Settings(BaseSettings):
    REFRESH_TOKEN_MAX_AGE: int = 604800
    ACCESS_TOKEN_MAX_AGE: int = 900
    PASSWORD_ROUNDS: int = 12
    PASSWORD_PEPPER: str = "spicy_peper"

    COOKIE_SECURE: bool = True
    COOKIE_SAMESITE: str = "lax"

    POSTGRES_USER: str = "admin"
    POSTGRES_PASS: str = "admin"
    POSTGRES_HOST: str = "database"
    POSTGRES_BASE: str = "users_db"

    MONGO_USER: str = "admin"
    MONGO_PASS: str = "admin"
    MONGO_HOST: str = "messagebase:27017"
    MONGO_NAME: str = "messages_db"
    MONGO_DISCONECT_TIMEOUT: int = 5

    LOGS_FILE: str = f"{datetime.now().strftime("%d-%m-%Y_%H:%M")}.log"
    API_URL: str = "http://localhost"

    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"

    S3_ENDPOINT: str
    S3_SECRET: str
    S3_ACCESS: str
    S3_BUKKET: str
    S3_AVATARS: str

    BASE_AVATARS_URL: list[str] = [
        "https://9b410e25-b424-42f9-8c98-0f003b6b0bd3.selstorage.ru/pubertat_3.jpg",
        "https://9b410e25-b424-42f9-8c98-0f003b6b0bd3.selstorage.ru/pubertat_2.jpg",
        "https://9b410e25-b424-42f9-8c98-0f003b6b0bd3.selstorage.ru/pubertat_1.png",
        "https://cs15.pikabu.ru/post_img/2025/02/06/9/1738852265114233915.jpg",
        "https://img.freepik.com/free-photo/rendering-bee-anime-character_23-2150963632.jpg",
        "https://9b410e25-b424-42f9-8c98-0f003b6b0bd3.selstorage.ru/964470.jpg"
    ]

    WORKERS_COUNT: int = 8

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()