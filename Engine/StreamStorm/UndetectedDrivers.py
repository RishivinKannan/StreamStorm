from os.path import dirname, normpath, join        
from json import dump
from time import sleep
from undetected_chromedriver import Chrome
# from undetected_geckodriver import Firefox

from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, NoSuchWindowException, ElementNotInteractableException
# from selenium.webdriver import FirefoxOptions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.remote.webelement import WebElement

from .Selenium import Selenium


class UndetectedDrivers(Selenium):
    def __init__(self, base_profile_dir: str, browser_class: str) -> None:
        self.base_profile_dir: str = base_profile_dir
        self.browser_class: str = browser_class
        self.youtube_login_url: str = "https://accounts.google.com/ServiceLogin?service=youtube"
        self.config_json_path: str = join(dirname(normpath(self.base_profile_dir)), "config.json")
        
        super().__init__(base_profile_dir, "chrome", background=False)

    def initiate_config_json(self, no_of_channels: int = 0, channels: dict = None) -> None:

        data: dict = {
            "no_of_channels": no_of_channels,
            "channels": channels
        }
        
        try:
            with open(self.config_json_path, "w", encoding="utf-8") as file:
                dump(data, file, indent=4)
        except Exception as e:
            raise RuntimeError(f"Failed to create config.json: {e}")     
        

    def initiate_base_profile(self):
        if self.browser_class == "chromium":
            self.driver = Chrome(user_data_dir=self.base_profile_dir)
        elif self.browser_class == "gecko":
            raise NotImplementedError("Gecko-based browser is not implemented yet.")
        elif self.browser_class == "webkit":
            raise NotImplementedError("WebKit-based browser is not implemented yet.")
        else:
            raise ValueError("Unsupported browser class for undetected drivers")
        print(self.driver.browser_pid)
        
    def get_total_channels(self) -> int:
        
        try:
            # select first account if popup appears
            self.find_and_click_element(By.XPATH, "//ytd-popup-container//*[@id='contents']/ytd-account-item-renderer[1]", for_profiles_init=True)
        except (NoSuchElementException, ElementNotInteractableException):
            pass
        
        self.find_and_click_element(By.XPATH, '//*[@id="avatar-btn"]')
        self.find_and_click_element(By.XPATH, "//*[text()='Switch account']")

        WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[@id='submenu']//*[@id='container']//*[@id='contents']//*[@id='contents']/ytd-account-item-renderer")))

        channels_list: list[WebElement] = self.driver.find_elements(By.XPATH, "//*[@id='submenu']//*[@id='container']//*[@id='contents']//*[@id='contents']/ytd-account-item-renderer")
        
        channels = {}

        for index in range(len(channels_list)):
            try:
                self.driver.execute_script("arguments[0].scrollIntoView();", channels_list[index])
                
                channel_name_element: WebElement = channels_list[index].find_element(By.ID, "channel-title")
                channel_name: str = channel_name_element.text
                
                channel_logo_element: WebElement = channels_list[index].find_element(By.ID, "img")
                channel_logo_url: str = channel_logo_element.get_attribute("src")
                
                channels[index + 1] = {
                    "name": channel_name,
                    "logo": channel_logo_url
                }
                
            except NoSuchElementException:
                continue
        total_channels: int = len(channels_list)

        if total_channels == 0:
            raise RuntimeError("No YouTube channels found. Please add at least one channel to your YouTube account.")
        
        self.initiate_config_json(total_channels, channels)

    def youtube_login(self) -> None:
        self.driver.get(self.youtube_login_url)

        default_tab: str = self.driver.current_window_handle
        try:
            while True:
                tabs: list[str] = self.driver.window_handles
                
                for tab in tabs:
                    if tab != default_tab:
                        self.driver.switch_to.window(tab)
                        self.driver.close()
                        self.driver.switch_to.window(default_tab)
            
                if not self.driver.current_url.startswith("https://accounts.google.com/v3/signin"):
                    self.driver.get(self.youtube_login_url)
                
                if self.driver.current_url.startswith("https://www.youtube.com/"):
                    try:
                        WebDriverWait(self.driver, 10).until(
                            EC.presence_of_element_located((By.ID, "avatar-btn"))
                        )
                        print("Youtube login successful")
                        
                        self.get_total_channels()
                        
                        self.driver.close()
                        sleep(2)
                        
                        # try:                        
                        #     process = Process(self.driver.browser_pid)
                        #     while process.is_running():
                        #         sleep(0.5)
                        # except NoSuchProcess:
                        #     pass
                        
                        return
                    except NoSuchElementException:
                        self.driver.get(self.youtube_login_url)
                        
        except (NoSuchWindowException, AttributeError):
            raise RuntimeError("The Browser window was closed or not found. Please try again.")
