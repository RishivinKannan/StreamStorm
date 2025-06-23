from os import environ, makedirs, listdir
from os.path import exists
from shutil import copytree, rmtree, Error
from platformdirs import user_data_dir
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

from .UndetectedDrivers import UndetectedDrivers


class Profiles:
    def __init__(self, browser_class: str = None, browser: str = None) -> None:
        
        if not browser_class:
            browser_class: str = self.__get_browser_class(browser)        
        self.browser_class: str = browser_class
        
        self.app_data_dir: str = user_data_dir("StreamStorm", "DarkGlance")
        self.profiles_dir: str = self.__get_profiles_dir()
        self.base_profile_dir: str = self.profiles_dir + r"\BaseProfile"
            
    def __get_browser_class(self, browser) -> str:
        if browser in ("edge", "chrome"):
            return "chromium"

        elif browser in ("firefox",):
            raise NotImplementedError("Gecko-based browsers like Firefox are not supported yet.")
            return "gecko"

        elif browser in ("safari",):
            raise NotImplementedError("WebKit-based browsers like Safari are not supported yet.")
            # return "webkit"

        raise ValueError("Invalid browser")

    def __get_profiles_dir(self) -> str:
        if self.browser_class == "chromium":
            return self.app_data_dir + r"\ChromiumBasedBrowsers"

        # elif self.browser_class == "gecko":
        #     return self.app_data_dir + r"\GeckoBasedBrowsers"

        # elif self.browser_class == "webkit":
        #     return self.app_data_dir + r"\WebKitBasedBrowsers"
        
        
    def get_available_temp_profiles(self, for_deletion: bool = False) -> list[str]:
        temp_profiles: list[str] = [
            profile for profile in listdir(self.profiles_dir) if profile.startswith("temp_profile_")
        ]
        
        no_of_profiles: int = len(temp_profiles)

        if not for_deletion and no_of_profiles != 0:
            for i in range(1, no_of_profiles + 1):
                if f'temp_profile_{i}' not in temp_profiles:
                    raise ValueError(f"temp_profile_{i} is missing. Try rebuilding the environment.")
        
        return temp_profiles

    def get_profile_dir(self, index: int, profiles: list[str]) -> tuple[int, str]:

        index = index % len(profiles)
        tempdir: str = self.profiles_dir + f"\\{profiles[index]}"

        return index, tempdir
    
    def __delete_profiles_dir(self) -> None:
        if exists(self.profiles_dir):
            rmtree(self.profiles_dir, ignore_errors=True)
            print(f"Profiles directory {self.profiles_dir} deleted.")
    
    def __create_base_profile(self) -> None:
        if exists(self.base_profile_dir):
            rmtree(self.base_profile_dir)        
        
        makedirs(self.base_profile_dir, exist_ok=True)

        UD: UndetectedDrivers = UndetectedDrivers(self.base_profile_dir, self.browser_class)
        UD.initiate_base_profile()
        UD.youtube_login()

    def __create_profile(self, profile: str) -> None:

        print(f"Creating {profile}")

        tempdir: str = self.profiles_dir + f"\\{profile}"

        makedirs(tempdir, exist_ok=True)
        try:
            copytree(
                self.base_profile_dir,
                tempdir,
                dirs_exist_ok=True,
            )
        except Error as e:
            print("e", type(e), e)
            print("e.args", type(e.args), e.args)
            str_error: str = str(e)
            print("str_error", type(str_error), str_error)

        print(f"{profile} created")

    def create_profiles(self, limit: int) -> None:
        self.__delete_profiles_dir()
        self.__create_base_profile()
        
        profiles: list[str] = [f"temp_profile_{i}" for i in range(1, limit + 1)]
        
        if environ["mode"] == "mt":
            with ThreadPoolExecutor() as executor:
                executor.map(self.__create_profile, profiles)
                
        elif environ["mode"] == "mp":
            with ProcessPoolExecutor() as executor:
                executor.map(self.__create_profile, profiles)
            
    def delete_all_temp_profiles(self) -> None:
        
        self.__delete_profiles_dir()

__all__: list[str] = ["Profiles"]