from fastapi import APIRouter
from fastapi.responses import JSONResponse

from .ProfileRouter import router as profile_router

router: APIRouter = APIRouter(prefix="/environment")

router.include_router(profile_router)

@router.post("/channels/create")
async def create_channels() -> JSONResponse:
    # TODO: Create channels
    
    return JSONResponse(status_code=200, content={"success": True, "message": "Channels created successfully"})