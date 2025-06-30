from typing import Self, Optional
from pydantic import BaseModel, field_validator, model_validator

from .Profiles import Profiles


def Validate(data: dict, validator: BaseModel) -> BaseModel:
    try:
        validated_data = validator(**data)
        return validated_data.model_dump()
    
    except Exception as e:
        print(e)
        errors: list = e.errors()
        print(errors)
        if "ctx" in errors[0]:
            del errors[0]["ctx"]
        raise ValueError(f"Error in {errors[0]['loc'][0]} : {errors[0]['msg']}")

class StormDataValidation(BaseModel):
    video_url: str
    chat_url: str
    messages: list[str]
    subscribe: bool
    subscribe_and_wait: bool
    subscribe_and_wait_time: int
    slow_mode: int
    # start_account_index: int
    # end_account_index: int
    accounts: list[int]
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
        
        value = [ msg.strip('"[],') for msg in value ]
        
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

    @field_validator("browser")
    def validate_browser(cls, value: str) -> str:
        if value not in ["edge", "chrome"]:
            raise ValueError("Invalid browser")
        
        return value
    
    @field_validator("accounts")
    def validate_accounts(cls, value: list[int]) -> list[int]:
        if not value:
            raise ValueError("Accounts cannot be empty")
        
        if not all(isinstance(account, int) for account in value):
            raise ValueError("All accounts must be integers")
        
        if any(account < 0 for account in value):
            raise ValueError("Account IDs cannot be negative")
        
        return value
    
    @model_validator(mode = 'before')
    def before_validator(self) -> Self:
        return self
    
    
    @model_validator(mode = 'after')
    def validate_data(self) -> Self:
        if self.video_url.replace("watch", "live_chat") != self.chat_url:
            raise ValueError("Invalid video URL")
        
        self.accounts = list(set(self.accounts)) # Remove duplicates
        
        return self


class ProfileDataValidation(BaseModel):
    browser_class: str
    limit: Optional[int] = 1
    
    
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
    
    
class ChangeMessagesDataValidation(BaseModel):
    messages: list[str]
    
    @field_validator("messages")
    def validate_messages(cls, value: list[str]) -> list[str]:
        if not value:
            raise ValueError("Messages cannot be empty")
        
        value = [ msg.strip('"[],') for msg in value ]
        
        return value
    
class ChangeSlowModeDataValidation(BaseModel):
    slow_mode: int
    
    @field_validator("slow_mode")
    def validate_slow_mode(cls, value: int) -> int:
        if not isinstance(value, int):
            raise ValueError("Slow mode must be an integer")
        
        if value < 1:
            raise ValueError("Slow mode must be at least 1")

        return value

class StartMoreChannelsDataValidation(BaseModel):
    channels: list[int]

    @field_validator("channels")
    def validate_channels(cls, value: list[int]) -> list[int]:
        if not value:
            raise ValueError("Channels cannot be empty")

        return value
    
    @model_validator(mode='after')
    def validate_data(self) -> Self:

        self.channels = list(set(self.channels)) # Remove duplicates
        return self
    
    
class GetChannelsDataValidation(BaseModel):
    mode: str
    browser: str

    @field_validator("mode")
    def validate_mode(cls, value: str) -> str:
        if value not in ["new", "add"]:
            raise ValueError("Invalid mode")
        
        return value

    @field_validator("browser")
    def validate_browser(cls, value: str) -> str:
        if value not in [
            "chrome", 
            "edge",
            # "firefox",
            # "safari"
        ]:
            raise ValueError("Invalid browser")

        return value
    
    @model_validator(mode='after')
    def validate_data(self) -> Self:
        self.browser = self.browser.lower()
        
        browser_class: str = Profiles._get_browser_class(self.browser)
        
        if browser_class =="chromium":
            self.browser = "ChromiumBasedBrowsers"
        elif browser_class == "gecko":
            self.browser = "GeckoBasedBrowsers"
        elif browser_class == "webkit":
            self.browser = "WebKitBasedBrowsers"

        return self