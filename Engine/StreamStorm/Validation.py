from typing import Self, Optional
from pydantic import BaseModel, field_validator, model_validator


class StormDataValidation(BaseModel):
    video_url: str
    chat_url: str
    messages: list[str]
    subscribe: bool
    subscribe_and_wait: bool
    subscribe_and_wait_time: int
    slow_mode: int
    start_account_index: int
    end_account_index: int
    browser: str
    background: bool

    @field_validator("video_url")
    def validate_video_url(cls, value: str) -> str:
        if not value.startswith("https://www.youtube.com/watch?v="):
            raise ValueError("Invalid video url")
        
        if value.split("https://www.youtube.com/watch?v=")[1] == "":
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
        
        return value

    @field_validator("subscribe_and_wait_time")
    def validate_subscribe_and_wait_time(cls, value: int) -> int:
        if value < 0:
            raise ValueError("Subscribe and wait time cannot be negative")
        
        return value

    @field_validator("slow_mode")
    def validate_slow_mode(cls, value: int) -> int:
        if value < 0:
            raise ValueError("Slow mode cannot be negative")
        
        return value

    @field_validator("start_account_index", "end_account_index")
    def validate_account_index(cls, value) -> int:
        
        if value < 0:
            raise ValueError("Account index cannot be negative")
        
        return value   
    

    @field_validator("browser")
    def validate_browser(cls, value: str) -> str:
        if value not in ["edge", "chrome"]:
            raise ValueError("Invalid browser")
        
        return value
    
    
    @model_validator(mode = 'after')
    def validate_urls(self) -> Self:
        if self.video_url.replace("watch", "live_chat") != self.chat_url:
            raise ValueError("One of the urls is invalid")
        
        if self.start_account_index > self.end_account_index:
            raise ValueError("Start account index cannot be greater than end account index")
        
        return self


class ProfileDataValidation(BaseModel):
    browser_class: str
    limit: Optional[int] = None
    
    
    @field_validator("browser_class")
    def validate_browser(cls, value: str) -> str:
        if value not in [
            "chromium", 
            # "gecko", 
            # "webkit"
        ]:
            raise ValueError("Invalid browser class")

        return value
    
    @field_validator("limit")
    def validate_limit(cls, value: Optional[int]) -> Optional[int]:
        if value is not None and value < 0:
            raise ValueError("Limit cannot be negative")
        
        return value