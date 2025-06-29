from time import sleep
from threading import Thread
from random import choice
from os import environ
from typing import Self
from json import load
from http.client import RemoteDisconnected
from urllib3.exceptions import ProtocolError, ReadTimeoutError
from concurrent.futures import ThreadPoolExecutor
from threading import Event

from selenium.common.exceptions import InvalidSessionIdException

from .Selenium import Selenium
from .SeparateAccount import SeparateAccount
from .Profiles import Profiles
from .Lib import clear_ram


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
        # start_account_index: int = 1,
        # end_account_index: int = 10,
        accounts: list[int] = None,
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
        # self.start_account_index: int = start_account_index
        # self.end_account_index: int = end_account_index
        self.accounts: list[int] = sorted(accounts)
        self.browser: str = browser
        self.background: bool = background
        
        self.shared_data: dict = shared_data
        
        self.ready_event: Event = Event()
        self.pause_event: Event = Event()
        
        self.total_instances: int = len(accounts)
        self.ready_to_storm_instances: int = 0
        self.total_channels: int = 0
        self.all_channels: dict[str, dict[str, str]] = {}
        
        self.assigned_profiles: dict[str, int] = {}
        
        StreamStorm.ss_instance = self
        
        clear_ram()
        
    def check_channels_available(self) -> None:
        try:
            with open(self.profiles_dir + r"\config.json", "r", encoding="utf-8") as file:
                data: dict = load(file)
        except FileNotFoundError:
            raise FileNotFoundError("Create profiles first.")
            
        no_of_channels: int = data.get("no_of_channels", 0)

        self.total_channels = no_of_channels
        self.all_channels = data.get("channels", {})

        if no_of_channels < len(self.accounts):
            raise ValueError("Not enough channels available in your YouTube account. Create enough channels first. Then create Profiles again.")
        
    def get_active_channels(self) -> list[int]:
        active_channels: list[int] = []
        
        for channel_index in self.assigned_profiles.values():
            if channel_index is not None:
                active_channels.append(channel_index)
                
        return active_channels
        
    def EachAccount(self, index: int, profile_dir: str, wait_time: float = 0, op_mode: str = "mt") -> None:
        
        print(f"Using profile: {profile_dir}")
        profile_dir_name: str=  profile_dir.split("\\")[-1]
        
        try:

            Separate_Account = SeparateAccount(
                index,
                profile_dir,
                self.browser,
                self.background,
            )

            print("Separate Account obj created")

            self.assigned_profiles[profile_dir_name] = index

            print("Assigned profile to account:", index)

            StreamStorm.each_account_instances.append(Separate_Account)
            print("Added Separate Account to each_account_instances")
            logged_in: bool = Separate_Account.login()
            print("Logged in:", logged_in)
            
            if not logged_in:
                self.total_instances -= 1
                self.assigned_profiles[profile_dir_name] = None
                StreamStorm.each_account_instances.remove(Separate_Account)
                print(f"========================= Login failed on account {index} : {self.all_channels[str(index)]['name']}. =========================")
                return

            if self.subscribe[0]:
                Separate_Account.go_to_page(self.url)
                Separate_Account.subscribe_to_channel()

            Separate_Account.driver.set_window_size(500, 800)
            Separate_Account.go_to_page(self.chat_url)
            
            self.ready_to_storm_instances += 1
            print(f"@@@@@@@@@@@@@@@@@@@@@@@@@ Account {index} : {self.all_channels[str(index)]['name']} is ready @@@@@@@@@@@@@@@@@@@@@@@@@")

            if self.subscribe[1]:
                sleep(self.subscribe_and_wait_time)
                 
                
            self.ready_event.wait() # Wait for the ready event to be set before starting the storming

            sleep(wait_time)  # Wait for the initial delay before starting to storm

            while True:
                if op_mode == "mt":
                    self.pause_event.wait()
                
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
        ) as e:
            print(f"Error in account {index}: {e}")
            pass
        
    def get_start_storm_wait_time(self, index, no_of_profiles, slow_mode) -> float:
        return index * (slow_mode / no_of_profiles)

    def start(self) -> None:
        if environ["mode"] == "mp":
            raise NotImplementedError("Multi-processing mode is not implemented yet.")

        
        

        self.ready_event.clear()  # Wait for the ready event to be set before starting the storming
        self.ready_to_storm_instances = 0
        
        self.check_channels_available()
        
        if self.accounts[-1] > self.total_channels:
            raise ValueError("You have selected more accounts than available channels in your YouTube account. Create enough channels first.")
        
        
        temp_profiles: list[str] = self.get_available_temp_profiles()
        no_of_temp_profiles: int = len(temp_profiles)
        
        self.assigned_profiles = {profile: None for profile in temp_profiles}
        
        
        
        if no_of_temp_profiles < len(self.accounts):
            raise ValueError("Not enough temp profiles available. Create Enough profiles first.")       
        

        def start_each_worker() -> None:
            
            def wait_for_all_worker_to_be_ready() -> None:
                while self.ready_to_storm_instances < self.total_instances:
                    sleep(1)
                self.ready_event.set()  # Set the event to signal that all instances are ready
            
            if environ["mode"] == "mt":      
                 
                Thread(target=wait_for_all_worker_to_be_ready).start()     
                with ThreadPoolExecutor() as executor:
                    for index in range(len(self.accounts)):
                        profile_dir: str = self.profiles_dir + f"\\{temp_profiles[index]}"
                        wait_time: int = self.get_start_storm_wait_time(index, no_of_temp_profiles, self.slow_mode)

                        executor.submit(self.EachAccount, self.accounts[index], profile_dir, wait_time)
                        sleep(0.2)  # Small delay to avoid instant spike of the cpu load
                
                environ["BUSY"] = "False"
                print("All threads completed")
                
            elif environ["mode"] == "mp":
                ...

        Thread(target=start_each_worker).start()
    
    def start_more_channels(self, channels: list[int]) -> None:
        
        def get_profiles() -> tuple[bool, list[str]]:
            count: int = 0
            available_profiles: list[str] = []
            for key, value in self.assigned_profiles.items():
                if value is None:
                    count += 1
                    available_profiles.append(key)

            return count >= len(channels), available_profiles[:len(channels)]

        enough_profiles, available_profiles = get_profiles()

        already_running_channels: list[int] = self.assigned_profiles.values()

        for channel in channels:
            if channel in already_running_channels:
                raise ValueError(f"Channel {channel} : {self.all_channels[str(channel)]['name']} is already running.")
        if not enough_profiles:
            raise ValueError("Not enough available profiles to start more channels.")

        with ThreadPoolExecutor() as executor:
            for index in range(len(channels)):
                print(index, len(available_profiles), channels[index], available_profiles[index], self.slow_mode)
                profile_dir: str = self.profiles_dir + f"\\{available_profiles[index]}"
                wait_time: int = self.get_start_storm_wait_time(index, len(available_profiles), self.slow_mode)

                executor.submit(self.EachAccount, channels[index], profile_dir, wait_time)
                sleep(0.2)
            
        
        

        