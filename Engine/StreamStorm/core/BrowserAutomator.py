from abc import ABC, abstractmethod

class BrowserAutomator(ABC):

    @abstractmethod
    async def open_browser(self) -> None:
        """Open a browser and navigate to the specified URL."""
        pass

    @abstractmethod
    async def go_to_page(self, url: str) -> None:
        """Navigate to the specified URL."""
        pass

    @abstractmethod
    async def find_and_click_element(self, *args, **kwargs) -> None:
        """Find an element and click it."""
        pass

    @abstractmethod
    async def find_element(self, *args, **kwargs) -> None:
        """Find an element on the page."""
        pass

    @abstractmethod
    async def type_and_enter(self, *args, **kwargs) -> None:
        """Type a message into a text field and press enter."""
        pass
    

__all__: list[str] = ['BrowserAutomator']
