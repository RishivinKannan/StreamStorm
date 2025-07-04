from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import ElementNotInteractableException
from time import sleep

from .Exceptions import DriverClosedError
from .Selenium import Selenium

class SeparateInstance(Selenium):
    def __init__(
        self,
        index: int = 0,
        user_data_dir: str = '',
        browser: str = 'edge',
        background: bool = True
    ) -> None:
        super().__init__(user_data_dir, browser, background)
        
        self.index: int = index


    def login(self) -> bool:
        
        

        self.open_browser()

        self.go_to_page("https://www.youtube.com/account") # We are going to account page because it loads faster than the main page

        try:
            self.find_and_click_element(By.XPATH, '//*[@id="avatar-btn"]') # Click on avatar button
            self.find_and_click_element(By.XPATH, "//*[text()='Switch account']") # Click on switch account button
            
            sleep(3)
            
            self.__click_channel(self.index)
            
            return True
        except DriverClosedError as _:           
            
            return False


    def __click_channel(self, index: int) -> None:
        
        self.find_and_click_element(
            By.XPATH,
            f"//*[@id='contents']/ytd-account-item-renderer[{index}]"
        )

    def subscribe_to_channel(self) -> None:
                    
        self.find_and_click_element(
            By.XPATH,
            "//div[@id='subscribe-button']/*//button[.//span[text()='Subscribe']]",
            False,
            True
        )
        
            
        
    def __get_chat_field(self) -> WebElement:
        chat_field: WebElement = WebDriverWait(self.driver, 15).until(EC.presence_of_element_located((By.XPATH, "//yt-live-chat-text-input-field-renderer//div[@id='input']")))
        
        return chat_field
    
    def send_message(self, message: str) -> None:
        try:
            chat_field: WebElement = self.__get_chat_field()
            self.type_and_enter(chat_field, message)
        except ElementNotInteractableException as _:
            self.driver.execute("alert", {"text": "Element not interactable. Please check the chat field."})
        
        




__all__: list[str] = ['SeparateInstance']