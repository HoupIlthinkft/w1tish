from pydantic_settings import BaseSettings, SettingsConfigDict
from box import Box
import yaml
from datetime import datetime

class Settings(BaseSettings):

    S3_ENDPOINT: str
    S3_SECRET: str
    S3_ACCESS: str
    S3_BUKKET: str
    S3_AVATARS: str

    JWT_SECRET: str


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

    JWT_ALGORITHM: str = "HS256"

    MAX_AVATAR: int = 1024 * 1024 * 5

    WORKERS_COUNT: int = 8

    model_config = SettingsConfigDict(env_file=".env")

with open('config.yml') as f:
    config = Box(yaml.safe_load(f))

settings = Settings()