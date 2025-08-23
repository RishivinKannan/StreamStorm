from typing import Any, AsyncGenerator
from fastapi import FastAPI
from contextlib import asynccontextmanager
from asyncio import create_task
from logging import Logger, getLogger

from .StormStopper import background_storm_stopper

logger: Logger = getLogger("fastapi." + __name__)

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, Any]:
    logger.info("Starting StreamStorm Engine...")
    # Start the background storm stopper task
    create_task(background_storm_stopper())

    yield

    logger.info("Shutting Down Engine....")


__all__: list[str] = ["lifespan"]