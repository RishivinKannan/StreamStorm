from logging import Logger, getLogger

from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import ElementNotInteractableException
from selenium.webdriver.common.by import By

from ..utils.exceptions import BrowserClosedError, ElementNotFound
from .BrowserAutomator import BrowserAutomator
        
logger: Logger = getLogger(f"streamstorm.{__name__}")

class Selenium(BrowserAutomator):
    __slots__: tuple[str, ...] = ('user_data_dir', 'background', 'driver')
    
    def __init__(self, user_data_dir: str, background: bool) -> None:
        self.user_data_dir: str = user_data_dir
        self.background: bool = background
        
    def go_to_page(self, url: str) -> None:
        self.driver.get(url)

    def find_element(self, by: str, value: str, wait_time: int = 15) -> WebElement:
        try:
            element: WebElement = WebDriverWait(self.driver, wait_time).until(EC.element_to_be_clickable((by, value)))
            
        except TimeoutException as e:
            raise ElementNotFound from e
        
        return element


    def find_and_click_element(self, by: str, value: str, scroll: bool = True, for_subscribe: bool = False, for_profiles_init: bool = False) -> None:

        try:
            element: WebElement = self.find_element(by, value, wait_time=5 if for_profiles_init else 15)

            if scroll:
                self.driver.execute_script("arguments[0].scrollIntoView();", element)
            element.click()

        except (ElementNotInteractableException, ElementNotFound) as e:
            logger.error(f"Element not found: {by} : {value} : {e}")
            
            if not for_subscribe and not for_profiles_init:
                self.driver.close()
                raise BrowserClosedError from e
            
    def check_language_english(self) -> bool:
        html_tag: WebElement = self.find_element(By.TAG_NAME, "html")
        language: str = html_tag.get_attribute("lang")
        
        return language.startswith("en-") 
    
    def change_language(self):
        raise NotImplementedError
    
        
    async def open_browser(self):
        """
        No-op async method to satisfy the abstract base class. Not used in Selenium context.
        """
        return
    
    async def type_and_enter(self, by: str, value: str, message: str) -> None:
        """
        No-op async method to satisfy the abstract base class. Not used in Selenium context.
        """
        return
        
          
    
        
        
__all__: list[str] = ['Selenium']