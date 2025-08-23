from selenium.webdriver import Edge, EdgeOptions
from selenium.webdriver.common.by import By
from time import sleep, time
from os import getenv

from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

class StreamStorm:
    def __init__(self) -> None:
        self.url = 'https://www.youtube.com'
        # self.url: str = 'https://youtu.be/u_lQJc-R-Ng?si=MzXKda8jj10GzYiL'
        
        options = EdgeOptions()
        options.add_argument(r'user-data-dir=C:\Users\{}\AppData\Local\Microsoft\Edge\User Data'.format(getenv('USERNAME')))
        options.add_argument("--blink-settings=imagesEnabled=false")
        options.add_argument("--autoplay-policy=user-gesture-required")
        options.add_argument("--disable-notifications")
        options.add_argument("--headless")
        
        start: float = time()
        self.driver = Edge(options=options)
        self.driver.get(self.url)
        # input()
        sleep(2)
        
        avatar_button: WebElement = self.driver.find_element(By.XPATH, '//*[@id="avatar-btn"]')
        avatar_button.click()
        
        sleep(2)
        
        switch_account_button: WebElement = self.driver.find_element(By.XPATH, "//*[text()='Switch account']")
        switch_account_button.click()
        
        sleep(2)
        
        one_account: WebElement = self.driver.find_element(By.XPATH, "//*[@id='contents']/ytd-account-item-renderer[34]")
        self.driver.execute_script("arguments[0].scrollIntoView();", one_account)
        one_account.click()
        
        input()
        video_url: str = 'https://www.youtube.com/live_chat?is_popout=1&v=UTMF2u9K5dg'
        # video_url: str = 'https://www.youtube.com/watch?v=UTMF2u9K5dg'
        self.driver.get(video_url)
        
        # sleep(15)
        
        # subscribe_btn: WebElement = self.driver.find_element(By.XPATH, "//div[@id='subscribe-button']/*//button[.//span[text()='Subscribe']]")
        # subscribe_btn.click()
        
        # sleep(2)
        
        input_field: WebElement = WebDriverWait(self.driver, 15).until(EC.presence_of_element_located((By.XPATH, "//yt-live-chat-text-input-field-renderer//div[@id='input']")))
        # input_field: WebElement = self.driver.find_element(By.XPATH, "//yt-live-chat-text-input-field-renderer[@id='input']//div[@id='input']")
        # input_field.click()
        
        
        sleep(1)
        input_field.send_keys('Hello')
        # self.driver.execute_script("arguments[0].innerText = 'Hello'", input_field)
        
        
        sleep(2)
        
        input_field.send_keys(Keys.ENTER)
        
        
        
        
        
        
        
        
        
if __name__ == '__main__':
    try:
        StreamStorm()
    except Exception as e:
        from logging import error as log_error
        log_error(e)
    finally:
        sleep(1000)
        
        
        # //*[@id="input"]
        # //*[@id="input"]