from asyncio import sleep
from playwright.async_api._generated import Locator

from .Exceptions import BrowserClosedError
from .Playwright import Playwright

class SeparateInstance(Playwright):
    def __init__(
        self,
        index: int = 0,
        user_data_dir: str = '',
        background: bool = True
    ) -> None:
        super().__init__(user_data_dir, background)
        
        self.index: int = index


    async def login(self) -> bool:        

        try:
            await self.open_browser()
            await self.go_to_page("https://www.youtube.com/account") # We are going to account page because it loads faster than the main page
            
            await self.find_and_click_element('//*[@id="avatar-btn"]') # Click on avatar button
            await self.find_and_click_element("//*[text()='Switch account']") # Click on switch account button

            await sleep(3)
            await self.__click_channel(self.index)

            return True
        
        except BrowserClosedError as _:  
            return False


    async def __click_channel(self, index: int) -> None:

        await self.find_and_click_element(
            f"//*[@id='contents']/ytd-account-item-renderer[{index}]"
        )

    async def subscribe_to_channel(self) -> None:

        await self.find_and_click_element(
            "//div[@id='subscribe-button']/*//button[.//span[text()='Subscribe']]",
            True
        )           
        
    async def __get_chat_field(self) -> Locator:
        chat_field: Locator = await self.find_element("//yt-live-chat-text-input-field-renderer//div[@id='input']")
        return chat_field

    async def send_message(self, message: str) -> None:
        chat_field: Locator = await self.__get_chat_field()
        await self.type_and_enter(chat_field, message)
        
        




__all__: list[str] = ['SeparateInstance']