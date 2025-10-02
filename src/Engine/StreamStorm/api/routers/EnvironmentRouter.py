from fastapi import APIRouter
from fastapi.responses import JSONResponse  # noqa: F401

from .ProfileRouter import router as profile_router

router: APIRouter = APIRouter(prefix="/environment")

router.include_router(profile_router)