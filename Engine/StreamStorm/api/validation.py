from typing import Self, Optional
from warnings import deprecated
from pydantic import BaseModel, ConfigDict, field_validator, model_validator, StrictInt, Field
from logging import getLogger, Logger

logger: Logger = getLogger("fastapi." + __name__)

@deprecated("Not used anymore since migrated to FastAPI")
def Validate(data: dict, validator: BaseModel) -> dict:
    try:
        validated_data = validator(**data)
        return validated_data.model_dump()
    
    except Exception as e:
        logger.error(f"Validation error: {e}")
        errors: list = e.errors()
        if "ctx" in errors[0]:
            del errors[0]["ctx"]
        raise Exception(f"Error in {errors[0]['loc'][0]} : {errors[0]['msg']}")

class StormData(BaseModel):
    
    model_config = ConfigDict(strict=True)
    
    video_url: str = Field(..., description="Video url must start with 'https://www.youtube.com/watch?v=' and end with the video id")
    chat_url: str = Field(... , description="Chat url must start with 'https://www.youtube.com/live_chat?v=' and end with the video id")
    messages: list[str] = Field(..., description="Messages cannot be empty and messages must be list of strings")
    subscribe: bool = Field(... , description="Subscribe must be a boolean")
    subscribe_and_wait: bool = Field(..., description="Subscribe and wait must be a boolean")
    subscribe_and_wait_time: StrictInt = Field(... , ge=0, description="Subscribe and wait time must be an integer and at least 0")
    slow_mode: int = Field(... , ge=1, description="Slow mode must be an integer and at least 1")
    channels: list[int] = Field(... , description="Channels cannot be empty and channels must be integers")
    background: bool = Field(... , description="Background must be a boolean")

    @field_validator("video_url")
    def validate_video_url(cls, value: str) -> str:
        if not value.startswith("https://www.youtube.com/watch?v="):
            raise ValueError("Invalid video url")
        
        if " " in value:
            raise ValueError("Invalid video url")
                
        id: str = value.split("https://www.youtube.com/watch?v=")[1]
        id = id.split("&")[0]
        id = id.strip("/")
        
        if id == "":
            raise ValueError("Invalid video url")
        
        if len(id) != 11:
            raise ValueError("Invalid video url")
        
        return value

    @field_validator("chat_url")
    def validate_chat_url(cls, value: str) -> str:
        if not value.startswith("https://www.youtube.com/live_chat?v="):
            raise ValueError("Invalid chat url")
        
        return value
        
        
    @field_validator("messages")
    def validate_messages(cls, value: list[str]) -> list[str]:
        if not value:
            raise ValueError("Messages cannot be empty")
        
        value = [ msg.strip('"[],') for msg in value ]
        
        return value


    
    @field_validator("channels")
    def validate_channels(cls, value: list[int]) -> list[int]:
        if not value:
            raise ValueError("Channels cannot be empty")
        
        if not all(isinstance(channel, int) for channel in value):
            raise ValueError("All channels must be integers")
        
        if any(channel <= 0 for channel in value):
            raise ValueError("Channel IDs must be positive integers")

        return value
    
    
    @model_validator(mode = 'after')
    def validate_data(self) -> Self:
        if self.video_url.replace("watch", "live_chat") != self.chat_url:
            raise ValueError("Invalid Video/Chat URL")
        
        self.channels = list(set(self.channels)) # Remove duplicates
        
        return self


class ProfileData(BaseModel):
    count: StrictInt = Field(... , ge=1, description="Count must be an integer and at least 1")
    
    
    
class ChangeMessagesData(BaseModel):
    messages: list[str]
    
    @field_validator("messages")
    def validate_messages(cls, value: list[str]) -> list[str]:
        if not value:
            raise ValueError("Messages cannot be empty")
        
        value = [ msg.strip('"[],') for msg in value ]
        
        return value
    
class ChangeSlowModeData(BaseModel):
    # slow_mode: int = Field(... , ge=1, description="Slow mode must be an integer and at least 1")
    slow_mode: int
    @field_validator("slow_mode")
    def validate_slow_mode(cls, value: int) -> int:
        if not isinstance(value, int):
            raise ValueError("Slow mode must be an integer")
        
        if value < 1:
            raise ValueError("Slow mode must be at least 1")

        return value

class StartMoreChannelsData(BaseModel):
    channels: list[int]

    @field_validator("channels")
    def validate_channels(cls, value: list[int]) -> list[int]:
        if not value:
            raise ValueError("Channels cannot be empty")
        
        if not all(isinstance(channel, int) for channel in value):
            raise ValueError("All channels must be integers")
        
        if any(channel <= 0 for channel in value):
            raise ValueError("Channel IDs must be positive integers")

        return value
    
    @model_validator(mode='after')
    def validate_data(self) -> Self:

        self.channels = list(set(self.channels)) # Remove duplicates
        return self
    
    
class GetChannelsData(BaseModel):
    mode: str

    @field_validator("mode")
    def validate_mode(cls, value: str) -> str:
        if value not in ["new", "add"]:
            raise ValueError("Invalid mode")
        
        return value
    
    
__all__ : list[str] = [
    "StormData",
    "ProfileData",
    "ChangeMessagesData",
    "ChangeSlowModeData",
    "StartMoreChannelsData",
    "GetChannelsData",
    "Validate"
]