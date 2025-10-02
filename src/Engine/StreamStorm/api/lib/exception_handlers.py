from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

async def common_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Common exception handler for all exceptions.
    """
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": f"An error occurred: {str(exc)}"},
    )
    
    
async def validation_exception_handler(request: Request, exc: RequestValidationError):

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": exc.errors()[0]["msg"],
        },
    )
    
    
    
__all__: list[str] = [
    "common_exception_handler",
    "validation_exception_handler",
]

