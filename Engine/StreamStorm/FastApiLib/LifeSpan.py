from fastapi import FastAPI
from contextlib import asynccontextmanager
from asyncio import create_task

from .StormStopper import background_storm_stopper

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting StreamStorm Engine...")
    # Start the background storm stopper task
    create_task(background_storm_stopper())

    yield

    print("Shutting Down Engine....")
    
    
__all__: list[str] = ["lifespan"]