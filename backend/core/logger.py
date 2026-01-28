import logging
import os
from backend.core.config import settings

FORMAT = "%(asctime)s: [%(levelname)s](%(name)s) --> %(message)s"
logs_path = "backend/logs"

def setup_logging():
    if not os.path.isdir(logs_path):
        os.makedirs(logs_path, exist_ok=True)

    logging.basicConfig(
        level=logging.INFO,
        format=FORMAT,
        handlers=[logging.FileHandler(f"backend/logs/{settings.LOGS_FILE}")]
    )

    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)