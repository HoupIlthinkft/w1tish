from fastapi import FastAPI, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings

import logging
from backend.core.logger import setup_logging
setup_logging()
logger = logging.getLogger(__name__)

from backend.api import auth,data
from backend.dependencies.dependencies import lifespan
from backend.utils.exceptions_handlers import setup_exception_handlers

app = FastAPI(lifespan=lifespan)
setup_exception_handlers(app)

app.include_router(auth.auth_router)
app.include_router(data.data_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # для тестирования разрешаем все источники
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def status():
    return {"status":"ok"}


@app.get("/config.js")
def get_config():
    content = f"window.ENV = {{ API_URL: '{settings.API_URL}' }};"
    
    return Response(
        content=content, 
        media_type="application/javascript"
    )

app.mount("/", StaticFiles(directory="frontend", html=True), name="static")
