from fastapi import FastAPI, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings, config
from fastapi.openapi.docs import get_swagger_ui_html

import logging
from backend.core.logger import setup_logging
setup_logging()
logger = logging.getLogger(__name__)

from backend.api import auth,data
from backend.dependencies.dependencies import lifespan
from backend.utils.exceptions_handlers import setup_exception_handlers

app = FastAPI(
    title="W1tish API",
    version="0.0.1",
    description=config.docs.api.description,
    docs_url=None,
    lifespan=lifespan
)
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

@app.get(
    "/health",
    summary=config.docs.health.summary
)
async def status():
    return {"status":"ok"}


@app.get(
    "/config.js",
    summary=config.docs.config.summary,
    description=config.docs.config.description
)
def get_config():
    env_variables = {
        "API_URL": settings.API_URL,
        "AVATARS_URL": settings.S3_AVATARS
    }
    content = ", ".join([f"{k}: '{v}'" for k, v in env_variables.items()])
    content = f"window.ENV = {{{content}}};"
    
    return Response(
        content=content, 
        media_type="application/javascript"
    )

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title="W1tish Docs",
        swagger_css_url="swagger.css",
        swagger_ui_parameters=config.swagger
    )

app.mount("/", StaticFiles(directory="frontend", html=True), name="static")
