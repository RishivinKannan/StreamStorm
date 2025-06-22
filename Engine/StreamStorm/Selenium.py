from time import sleep
from selenium.webdriver.chrome.service import Service

from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager
# from webdriver_manager.firefox import GeckoDriverManager

from selenium.webdriver import Edge, Chrome#, Firefox
from selenium.webdriver import EdgeOptions, ChromeOptions#, FirefoxOptions
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import ElementNotInteractableException
from selenium.webdriver.chromium.options import ChromiumOptions
from selenium.webdriver.chromium.webdriver import ChromiumDriver

from .Exceptions import ElementNotFound

class BrowserFactory:
    def __init__(self, browser: str) -> None:
        self.browser: str = browser

    def get_browser(self,  options: ChromiumOptions, service: Service=None) -> ChromiumDriver:
        if self.browser == 'edge':
            return Edge(options=options)
        elif self.browser == 'chrome':
            return Chrome(options=options)
        # elif self.browser == 'firefox':
        #     return Firefox(options=options)
        else:
            raise ValueError("Invalid browser")
        
    def get_options(self) -> ChromiumOptions:
        if self.browser == 'edge':
            return EdgeOptions()
        elif self.browser == 'chrome':
            return ChromeOptions()
        # elif self.browser == 'firefox':
        #     return FirefoxOptions()
        else:
            raise ValueError("Invalid browser")

class Selenium:
    def __init__(self, user_data_dir: str, browser: str, background: bool) -> None:
        self.driver = None
        self.user_data_dir: str = user_data_dir
        self.browser: str = browser
        self.background: bool = background
        
    def install_driver(self, browser: str) -> str:
        if browser == 'chrome':
            return ChromeDriverManager().install()
        elif browser == 'edge':
            return EdgeChromiumDriverManager().install()
        # elif browser == 'firefox':
        #     return GeckoDriverManager().install()
        else:
            raise ValueError("Invalid browser")
        
    def __add_all_options(self, browser: str, options: ChromiumOptions) -> ChromiumOptions:
        
        if browser in ('chrome', 'edge'):
            options.add_argument(r'user-data-dir={}'.format(self.user_data_dir))
            options.add_argument("--autoplay-policy=user-gesture-required")
            options.add_argument("--blink-settings=imagesEnabled=false")  # Disable image loading
            options.add_argument("--disable-crash-reporter")  # Disable crash reporting
            options.add_argument("--disable-background-timer-throttling")  # Optimize timers
            options.add_argument("--disable-background-networking")  # Reduce background activity
            options.add_argument("--disable-default-apps")  # Disable default apps
            options.add_argument("--disable-dev-shm-usage")  # Use /dev/shm efficiently on Linux
            # options.add_argument("--disable-extensions")  # Disable extensions
            options.add_argument("--disable-first-run-ui")
            options.add_argument("--disable-features=Translate,BackForwardCache")  # Avoid caching
            options.add_argument("--disable-gpu")  # Disable GPU acceleration
            options.add_argument("--disable-javascript")
            options.add_argument("--disable-lazy-loading")  # Disable local storage
            options.add_argument("--disable-logging")  # Disable logging
            options.add_argument("--disable-media-session-api")  # Avoid managing media
            options.add_argument("--disable-media-source")  # Avoid streaming media sources
            options.add_argument("--disable-infobars")  # Avoid infobars
            options.add_argument("--disable-notifications")
            options.add_argument("--disable-popup-blocking")  # Simplify rendering
            options.add_argument("--disable-renderer-backgrounding")  # Optimize rendering
            options.add_argument("--mute-audio")
            options.add_argument("--no-sandbox")  # Improve startup speed
            
        elif browser == 'firefox':
            ...
            
        return options

    def open_browser(self) -> None:
        
        browser: BrowserFactory = BrowserFactory(self.browser)
        
        options: ChromiumOptions = browser.get_options()
        
        if self.background:
            options.add_argument("--headless")
            
        options = self.__add_all_options(self.browser, options)
        
        self.driver: ChromiumDriver = browser.get_browser(options=options)
        
        self.driver.set_window_size(1200, 800)
        
    def go_to_page(self, url: str) -> None:
        self.driver.get(url)
        
    def __find_element(self, by: str, value: str) -> WebElement:
        try:
            element: WebElement = WebDriverWait(self.driver, 15).until(EC.element_to_be_clickable((by, value)))
        except TimeoutException as _:
            # print(e)
            raise ElementNotFound
        
        return element
    
    
    def find_and_click_element(self, by: str, value: str, scroll: bool = True, for_subscribe: bool = False) -> None:
        
        try:
            element: WebElement = self.__find_element(by, value)
            
            if scroll:
                self.driver.execute_script("arguments[0].scrollIntoView();", element)
            # input()
            element.click()
            
        except (ElementNotInteractableException, ElementNotFound):
            if for_subscribe:
                pass
            else:
                self.driver.quit()            
            
        except ElementNotFound:
            
            self.driver.quit()  
    
    def type_and_enter(self, text_field: WebElement, message: str) -> None:
        text_field.send_keys(message)
        text_field.send_keys(Keys.ENTER)
        
        
__all__: list[str] = ['Selenium']
    
if __name__ == '__main__':
    s = Selenium(r'C:\Users\ashif\AppData\Local\Microsoft\Edge\User Data')
    s.open_browser()
    sleep(100)
    # s.go_to_page('https://www.youtube.com')