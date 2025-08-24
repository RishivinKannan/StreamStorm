from typing import Callable
from logging import DEBUG, getLogger, Logger
from psutil import virtual_memory

from sys import path
path.append(".")
from config import CONFIG

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from ..core.StreamStorm import StreamStorm
from .lib.exception_handlers import (
    common_exception_handler,
    validation_exception_handler,
)
from .lib.LifeSpan import lifespan
from .lib.middlewares import LogRequestMiddleware, RequestValidationMiddleware
from ..utils.CustomLogger import CustomLogger
from .routers.StormRouter import router as storm_router
from .routers.ProfileRouter import router as profile_router


CustomLogger().setup_fastapi_logging()

logger: Logger = getLogger("fastapi." + __name__)
logger.setLevel(DEBUG)

if CONFIG["ENV"] == "development":
    logger.debug("Instrumenting atatus")
    from atatus import Client, get_client
    from atatus.contrib.starlette import create_client, Atatus
    
    atatus_client: Client = get_client()
    
    if atatus_client is None:
        atatus_client = create_client(
            {
                'APP_NAME': 'StreamStormEngine',
                'LICENSE_KEY': 'lic_apm_e9f8c52cb4b2439593c0ede154a933be',
                'TRACING': True,
                'ANALYTICS': True,
                'ANALYTICS_CAPTURE_OUTGOING': True,
                'LOG_BODY': 'all',
                'LOG_LEVEL': 'debug',
                'LOG_FILE': 'streamstorm.log'
            }
        )
    logger.debug("Atatus client created")
    
else:
    logger.debug("Skipping atatus instrumentation in production")

app: FastAPI = FastAPI(lifespan=lifespan)

app.exception_handlers = {
    Exception: common_exception_handler,
    HTTPException: common_exception_handler,
    SystemError: common_exception_handler,
    RuntimeError: common_exception_handler,
    RequestValidationError: validation_exception_handler,
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LogRequestMiddleware)
app.add_middleware(RequestValidationMiddleware)

@app.middleware("http")
async def add_cors_headers(request: Request, call_next: Callable):
    response: Response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

if CONFIG["ENV"] == "development":
    app.add_middleware(Atatus, client=atatus_client)
    logger.debug("Atatus middleware added to FastAPI app")

app.include_router(storm_router)
app.include_router(profile_router)

@app.get("/")
async def root() -> dict[str, str]:
    return {
        "message": "I am the StreamStorm Server"
    }
    
    
@app.get("/get_ram_info")
async def get_ram_info():
    return {
        "free": virtual_memory().available / (1024**3),
        "total": virtual_memory().total / (1024**3),
    }
    
    
@app.get("/engine-status")
async def status():
    response: dict = {}

    if StreamStorm.ss_instance is not None:
        response["storm_in_progress"] = True
    else:
        response["storm_in_progress"] = False

    return response
    

__all__: list[str] = ["app"]