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
from selenium.webdriver.chromium.options import ArgOptions
from selenium.webdriver.remote.webdriver import WebDriver

from .Exceptions import DriverClosedError, ElementNotFound

class BrowserFactory:
    def __init__(self, browser: str) -> None:
        self.browser: str = browser

    def get_browser(self,  options: ArgOptions) -> WebDriver:
        if self.browser == 'edge':
            return Edge(options=options)
        elif self.browser == 'chrome':
            return Chrome(options=options)
        # elif self.browser == 'firefox':
        #     return Firefox(options=options)
        else:
            raise ValueError("Invalid browser")
        
    def get_options(self) -> ArgOptions:
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
        
    def __add_all_options(self, browser: str, options: ArgOptions) -> ArgOptions:
        
        if browser in ('chrome', 'edge'):
            options.add_argument(r'user-data-dir={}'.format(self.user_data_dir))
            options.add_argument("--autoplay-policy=user-gesture-required")
            options.add_argument("--blink-settings=imagesEnabled=false")
            options.add_argument("--disable-animations")
            options.add_argument("--disable-crash-reporter")
            options.add_argument("--disable-background-timer-throttling")
            options.add_argument("--disable-background-networking")
            options.add_argument("--disable-best-effort-tasks")
            options.add_argument("--disable-component-extensions-with-background-pages")
            options.add_argument("--disable-default-apps")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-extensions")
            options.add_argument("--disable-first-run-ui")
            options.add_argument("--disable-features=Translate,BackForwardCache,Sync,MediaRouter,DialMediaRouteProvider")
            options.add_argument("--disable-gpu")
            options.add_argument("--disable-hang-monitor")
            options.add_argument("--disable-infobars")
            options.add_argument("--disable-logging")
            options.add_argument("--disable-media-session-api")
            options.add_argument("--disable-media-source")
            options.add_argument("--disable-notifications")
            options.add_argument("--disable-plugins")
            options.add_argument("--disable-renderer-backgrounding")
            options.add_argument("--disable-software-rasterizer")
            options.add_argument("--enable-low-end-device-mode")
            options.add_argument("--enable-unsafe-swiftshader")
            options.add_argument("--hide-scrollbars")
            options.add_argument("--metrics-recording-only")
            options.add_argument("--mute-audio")
            options.add_argument("--no-sandbox")
            options.add_argument("--password-store=basic")
            options.add_argument("--use-angle=swiftshader")
            options.add_argument("--use-gl=angle")
            
        elif browser == 'firefox':
            ...
            
        return options

    def open_browser(self) -> None:
        
        browser: BrowserFactory = BrowserFactory(self.browser)

        options: ArgOptions = browser.get_options()

        if self.background:
            options.add_argument("--headless=new")
            
        options = self.__add_all_options(self.browser, options)

        self.driver: WebDriver = browser.get_browser(options=options)

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
                self.driver.close()  
                raise DriverClosedError       
            
        except ElementNotFound:
            
            self.driver.close() 
            raise DriverClosedError
            
        
    
    def type_and_enter(self, text_field: WebElement, message: str) -> None:
        text_field.send_keys(message)
        text_field.send_keys(Keys.ENTER)
        
        
__all__: list[str] = ['Selenium']
    
if __name__ == '__main__':
    s = Selenium(r'C:\Users\ashif\AppData\Local\Microsoft\Edge\User Data')
    s.open_browser()
    sleep(100)
    # s.go_to_page('https://www.youtube.com')