from time import sleep
from undetected_chromedriver import Chrome
from undetected_geckodriver import Firefox

from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, NoSuchWindowException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class UndetectedDrivers:
    def __init__(self, base_profile_dir: str, browser_class: str) -> None:
        self.base_profile_dir: str = base_profile_dir
        self.browser_class: str = browser_class
        self.youtube_login_url: str = "https://accounts.google.com/ServiceLogin?service=youtube"
        
    def initiate_base_profile(self):
        if self.browser_class == "chromium":
            self.driver = Chrome(user_data_dir=self.base_profile_dir)
        elif self.browser_class == "gecko":
            self.driver = Firefox(user_data_dir=self.base_profile_dir)
        elif self.browser_class == "webkit":
            ...
        else:
            raise ValueError("Unsupported browser class for undetected drivers")
        print(self.driver.browser_pid)
        

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
            
                title: str = self.driver.title
                if title.lower() != "youtube":
                    self.driver.get(self.youtube_login_url)
                
                if self.driver.current_url.startswith("https://www.youtube.com/"):
                    try:
                        WebDriverWait(self.driver, 10).until(
                            EC.presence_of_element_located((By.ID, "avatar-btn"))
                        )
                        print("Youtube login successful")
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
