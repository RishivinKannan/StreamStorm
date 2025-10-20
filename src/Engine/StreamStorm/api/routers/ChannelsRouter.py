from pathlib import Path
from os import listdir

from fastapi import APIRouter
from fastapi.responses import JSONResponse  # noqa: F401

from .ProfileRouter import router as profile_router
from ...core.CreateChannels import CreateChannels
from ..validation import CreateChannelsData, VerifyChannelsDirectoryData

router: APIRouter = APIRouter(prefix="/channels")

router.include_router(profile_router)


@router.post("/create")
def create_channels(data: CreateChannelsData) -> JSONResponse:
    
    cc: CreateChannels = CreateChannels(data.logo_needed, data.random_logo)
    failed_list : list = cc.start(data.channels)
    
    response: dict = {
        "success": True,
        "message": "Channels created successfully",
        "failed": failed_list
    }
    
    return JSONResponse(
        status_code=200,
        content=response
    )
    
@router.post("/verify_dir")
async def verify_dir(data: VerifyChannelsDirectoryData) -> JSONResponse:
    
    path: Path = Path(data.directory)
    
    if not path.exists():
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Directory not found"
            }
        )
        
    if not path.is_dir():
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "Provided path is not a directory"
            }
        )
        
    files: list = listdir(path)
       
    if not files:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "Directory is empty"
            }
        )
        
    new_files: list = []
        
    for file in files:
        if not file.endswith(".png") and not file.endswith(".jpg") and not file.endswith(".jpeg"):
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "message": "Directory contains non-image files (Only png, jpg and jpeg files are supported)"
                }
            ) 
            
        file_name: str = '.'.join(file.split(".")[:-1])
        new_files.append({
            "name": file_name,
            "uri": str(path / file)
        })
        
    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "message": "Directory verified successfully",
            "files": new_files,
            "count": len(new_files),
        }
    )