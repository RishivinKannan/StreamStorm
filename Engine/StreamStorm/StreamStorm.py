from time import sleep
from threading import Thread
from random import choice
from os import environ
from typing import Self
from selenium.common.exceptions import InvalidSessionIdException
from http.client import RemoteDisconnected
from urllib3.exceptions import ProtocolError, ReadTimeoutError
from concurrent.futures import ThreadPoolExecutor
from threading import Event

from .Selenium import Selenium
from .SeparateAccount import SeparateAccount
from .Profiles import Profiles
from .Lib import clear_ram
from . import pause_event_mt


class StreamStorm(Selenium, Profiles):
    each_account_instances: list[SeparateAccount] = []
    ss_instance: Self = None

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
        shared_data: dict = None,
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
        self.shared_data: dict = shared_data
        self.ready_event: Event = Event()
        self.total_instances: int = end_account_index - start_account_index + 1
        self.ready_to_storm_instances: int = 0
        
        StreamStorm.ss_instance = self
        
        clear_ram()

    def start(self) -> None:
        if environ["mode"] == "mp":
            raise NotImplementedError("Multi-processing mode is not implemented yet.")

        self.ready_event.clear()  # Wait for the ready event to be set before starting the storming
        self.ready_instances = 0
        
        temp_profiles: list[str] = self.get_available_temp_profiles()
        no_of_temp_profiles: int = len(temp_profiles)
        
        if no_of_temp_profiles < (self.end_account_index - self.start_account_index + 1):
            raise ValueError("Not enough temp profiles available. Create Enough profiles first.")
        
        def get_start_storm_wait_time(index: int, no_of_profiles: int, slow_mode: int) -> int:
            return index * (slow_mode / no_of_profiles)

        def EachAccount(index: int, op_mode: str = "mt") -> None:
            try:
                profile_index, new_profile_dir = self.get_profile_dir(index, temp_profiles)
                print(f"Using profile: {new_profile_dir}")

                Separate_Account = SeparateAccount(
                    index,
                    new_profile_dir,
                    self.browser,
                    self.background,
                )
                
                StreamStorm.each_account_instances.append(Separate_Account)
                Separate_Account.login(self)

                if self.subscribe[0]:
                    Separate_Account.go_to_page(self.url)
                    Separate_Account.subscribe_to_channel()

                Separate_Account.driver.set_window_size(500, 800)
                Separate_Account.go_to_page(self.chat_url)
                
                self.ready_to_storm_instances += 1
                print(f"@@@@@@@@@@@@@@@@@@@@@@@@@ Instance {index} is ready @@@@@@@@@@@@@@@@@@@@@@@@@")

                if self.subscribe[1]:
                    sleep(self.subscribe_and_wait_time)
                    
                    
                self.ready_event.wait() # Wait for the ready event to be set before starting the storming
                    
                sleep(get_start_storm_wait_time(profile_index, no_of_temp_profiles, self.slow_mode))

                while True:
                    if op_mode == "mt":
                        pause_event_mt.wait()
                    
                    elif op_mode == "mp":
                        ...
                        # if self.shared_data["PAUSE"] == "True":
                        #     continue

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
            ):
                pass


        def start_each_worker() -> None:
            
            def wait_for_all_worker_to_be_ready() -> None:
                while self.ready_to_storm_instances < self.total_instances:
                    sleep(1)
                self.ready_event.set()  # Set the event to signal that all instances are ready
            
            if environ["mode"] == "mt":       
                Thread(target=wait_for_all_worker_to_be_ready).start()     
                with ThreadPoolExecutor() as executor:
                    # executor.map(EachAccount, range(self.start_account_index, self.end_account_index + 1))
                    
                    for index in range(self.start_account_index, self.end_account_index + 1):
                        executor.submit(EachAccount, index)
                        sleep(0.2)  # Small delay to avoid instant spike of the cpu load
                
                environ["BUSY"] = "False"
                print("All threads completed")
                
            elif environ["mode"] == "mp":
                ...

        Thread(target=start_each_worker).start()
