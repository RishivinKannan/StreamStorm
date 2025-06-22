from time import sleep
from threading import Thread
from random import choice
from os import getenv, environ


from selenium.common.exceptions import InvalidSessionIdException
from http.client import RemoteDisconnected
from urllib3.exceptions import ProtocolError, ReadTimeoutError

from .Selenium import Selenium
from .SeparateAccount import SeparateAccount
from .Profiles import Profiles


class StreamStorm(Selenium, Profiles):
    each_instances: list[SeparateAccount] = []

    def __init__(
        self,
        url: str,
        chat_url: str,
        messages: list[str] = ["Hello", "Hi"],
        subscribe: tuple[bool, bool] = (False, False),
        subscribe_and_wait_time: int = 70,
        slow_mode: int = 0,
        start_account_index: int = 1,
        end_account_index: int = 10,
        browser: str = "edge",
        background: bool = True,
    ) -> None:
        
        Profiles.__init__(self, browser=browser)
        
        self.url: str = url
        self.chat_url: str = chat_url
        self.messages: list[str] = messages
        self.subscribe: tuple[bool, bool] = subscribe
        self.subscribe_and_wait_time: int = subscribe_and_wait_time
        self.slow_mode: int = slow_mode
        self.start_account_index: int = start_account_index
        self.end_account_index: int = end_account_index
        self.browser: str = browser
        self.background: bool = background    
                

    def start(self) -> None:

        self.close_existing_browser_processes()
        
        temp_profiles: list[str] = self.get_available_temp_profiles()
        no_of_temp_profiles: int = len(temp_profiles)
        
        if no_of_temp_profiles < (self.end_account_index - self.start_account_index + 1):
            raise ValueError("Not enough temp profiles available. Create Enough profiles first.")

        def EachAccount(index: int) -> None:
            try:
                new_profile_dir: str = self.get_profile_dir(index, temp_profiles)
                print(f"Using profile: {new_profile_dir}")

                Separate_Account = SeparateAccount(
                    self.url,
                    self.chat_url,
                    self.messages,
                    index,
                    new_profile_dir,
                    self.browser,
                    self.background,
                )
                
                StreamStorm.each_instances.append(Separate_Account)
                Separate_Account.login()

                if self.subscribe[0]:
                    Separate_Account.go_to_page(self.url)
                    Separate_Account.subscribe_to_channel()

                Separate_Account.driver.set_window_size(500, 800)
                Separate_Account.go_to_page(self.chat_url)

                if self.subscribe[1]:
                    sleep(self.subscribe_and_wait_time)

                sleep(index)

                while True:
                    if getenv("PAUSE") == "True":
                        continue

                    # input()
                    Separate_Account.send_message(choice(self.messages))
                    sleep(self.slow_mode)

            except (
                InvalidSessionIdException,
                RemoteDisconnected,
                ProtocolError,
                ReadTimeoutError,
                ConnectionResetError,
                TimeoutError,
            ):  # Catch the exception when the driver is closed when '/stop' is invoked
                pass


        def start_each_thread() -> None:
            threads: list[Thread] = []
            
            for i in range(self.start_account_index, self.end_account_index + 1):
                print(str(i) * 50)

                thread: Thread = Thread(target=EachAccount, args=(i,))
                threads.append(thread)
                thread.start()

                # sleep(1)

            for thread in threads:
                thread.join()
                
            environ["BUSY"] = "False"

            print("All threads joined")

        Thread(target=start_each_thread).start()
