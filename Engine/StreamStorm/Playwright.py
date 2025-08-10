from playwright.async_api import (
    async_playwright,
    Playwright as AsyncPlaywright,
    TimeoutError as PlaywrightTimeoutError,
)
from playwright.async_api._generated import Browser, BrowserContext, Locator, Page

from .BrowserAutomator import BrowserAutomator
from .Exceptions import BrowserClosedError, ElementNotFound


class Playwright(BrowserAutomator):
    def __init__(self, user_data_dir: str, background: bool) -> None:
        self.user_data_dir: str = user_data_dir
        self.background: bool = background

    async def __get_chromium_options(self) -> dict[str, str | bool | list[str]]:
        options: dict[str, str | bool | list[str]] = {
            "user_data_dir": self.user_data_dir,
            "headless": self.background,
            "args": [
                "--autoplay-policy=user-gesture-required",
                "--blink-settings=imagesEnabled=false",
                "--disable-animations",
                "--disable-default-apps",
                "--disable-dev-shm-usage",
                "--disable-extensions",
                "--disable-logging",
                "--disable-notifications",
                "--enable-low-end-device-mode",
                "--hide-scrollbars",
                "--metrics-recording-only",
                "--mute-audio",
                "--no-sandbox",
                "--password-store=basic",
            ],
            "viewport": {"width": 1200, "height": 800},
            "channel": "chrome"
        }
        
        if self.background:
            options["args"].extend([
                "--disable-software-rasterizer",
                "--enable-unsafe-swiftshader",
                "--use-angle=swiftshader",
                "--use-gl=angle"
            ])

        return options

    async def __close_about_blank_page(self) -> None:
        """Close the about:blank page if it exists."""
        try:
            for page in self.browser.pages:
                if page.url == "about:blank":
                    await page.close()
                    break
        except Exception as e:
            print(f"Error closing about:blank page: {e}")
            
    async def __get_browser_version(self):
        browser_obj: Browser = await self.playwright.chromium.launch(channel="chrome")
        return browser_obj.version

    async def open_browser(self) -> None:
        self.playwright: AsyncPlaywright = await async_playwright().start()

        self.browser: BrowserContext = (
            await self.playwright.chromium.launch_persistent_context(
                **await self.__get_chromium_options()
            )
        )

        self.page: Page = await self.browser.new_page()

        self.page.set_default_navigation_timeout(15000)
        self.page.set_default_timeout(15000)
        
        await self.page.set_extra_http_headers({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                          f"(KHTML, like Gecko) Chrome/{await self.__get_browser_version()} Safari/537.36"
        })
        
    async def go_to_page(self, url: str) -> None:
        try:
            await self.page.goto(url)
            await self.__close_about_blank_page()
        except PlaywrightTimeoutError as e:
            print(f"Timeout error occurred while navigating to {url}: {e}")
            await self.page.close(
                reason="Browser closed due to timeout error"
            )
            raise BrowserClosedError

    async def find_element(self, selector: str) -> Locator:
        """Find an element on the page."""

        element: Locator = self.page.locator(selector)
        try:
            await element.wait_for(state="visible")
        except PlaywrightTimeoutError:
            raise ElementNotFound

        return element

    async def find_and_click_element(
        self, selector: str, for_subscribe: bool = False
    ) -> None:
        """Find an element and click it."""

        try:
            element = await self.find_element(selector)
            await element.click()
        except ElementNotFound:
            if for_subscribe:
                # Already Subscribed, thats why the element is not found
                pass
            else:
                await self.page.close(
                    reason="Browser closed due to element not found. Element: "
                    + selector
                )
                raise BrowserClosedError

    async def type_and_enter(self, text_field: Locator, message: str) -> None:
        """Type a message into a text field and press enter."""

        await text_field.fill(message)
        await text_field.press("Enter")


__all__: list[str] = ["Playwright"]

