from os import getenv, makedirs, listdir
from os.path import exists
from shutil import copytree, rmtree
from psutil import process_iter, NoSuchProcess, AccessDenied
from threading import Thread


class Profiles:
    def __init__(self, browser: str) -> None:
        self.browser: str = browser
        self.default_profile_dir: str = self.__get_default_profile_dir()
        self.default_profile_folder: str = self.__get_default_profile_folder()
        
        self.close_existing_browser_processes()
        
    def close_existing_browser_processes(self) -> None:           
        
        for process in process_iter(attrs=["pid", "name"]):
            try:
                if self.browser in process.info["name"].lower():
                    process.kill()
            except NoSuchProcess:
                pass
            except AccessDenied:
                raise RuntimeError("Access denied by the system. Start the app with admin privileges.")
            except Exception as e:
                raise RuntimeError(f"An unexpected error occurred: {e}")
        
    def __get_default_profile_dir(self) -> str:
        if self.browser == "edge":
            return r"C:\Users\{}\AppData\Local\Microsoft\Edge".format(
                getenv("USERNAME")
            )
        elif self.browser == "chrome":
            return r"C:\Users\{}\AppData\Local\Google\Chrome".format(
                getenv("USERNAME")
            )
        # elif self.browser == "firefox":
        #     return r"C:\Users\{}\AppData\Roaming\Mozilla\Firefox".format(
        #         getenv("USERNAME")
        #     )
        
        raise ValueError("Invalid browser")
        
    def __get_default_profile_folder(self) -> str:
        if self.browser == "edge":
            return "User Data"
        elif self.browser == "chrome":
            return "User Data"
        # elif self.browser == "firefox":
        #     return "Profiles"
        
        raise ValueError("Invalid browser")
        
        
    def get_available_temp_profiles(self) -> list[str]:
        temp_profiles: list[str] = [
            profile for profile in listdir(self.default_profile_dir) if profile.startswith("temp_profile_")
        ]
        
        no_of_profiles: int = len(temp_profiles)
        
        for i in range(1, no_of_profiles + 1):
            if f'temp_profile_{i}' not in temp_profiles:
                raise ValueError(f"temp_profile_{i} is missing. Try rebuilding the environment.")
        
        return temp_profiles
    
    
    def get_profile_dir(self, index: int, profiles: list[str]) -> str:        
        
        index = index % len(profiles)
        
        tempdir: str = self.default_profile_dir + f"\\{profiles[index]}"

        return tempdir
    
    def __create_profile(self, profile: str, fix: bool = False) -> None:
        
        print(f"{"Creating" if not fix else "Fixing"} {profile}")
        
        tempdir: str = self.default_profile_dir + f"\\{profile}"

        makedirs(tempdir, exist_ok=True)
        copytree(
            self.default_profile_dir + f"\\{self.default_profile_folder}",
            tempdir,
            dirs_exist_ok=True,
        )
        
        print(f"{profile} {"created" if not fix else "fixed"}")
            
    def create_profiles(self, limit: int) -> None:
        threads: list[Thread] = []
        for i in range(1, limit + 1):
            profile: str = f"temp_profile_{i}"
            thread: Thread = Thread(target=self.__create_profile, args=(profile,))
            threads.append(thread)
            thread.start()
            
        for thread in threads:
            thread.join()
            
            
    def __delete_profile(self, profile: str) -> None:
        
        print(f"Deleting {profile}")
        
        tempdir: str = self.default_profile_dir + f"\\{profile}"
        
        if exists(tempdir):
            rmtree(tempdir)
            
            print(f"{profile} deleted.")
            
    def delete_all_temp_profiles(self) -> None:
        threads: list[Thread] = []
        for profile in self.get_available_temp_profiles():
            thread: Thread = Thread(target=self.__delete_profile, args=(profile,))
            threads.append(thread)
            thread.start()
            
        for thread in threads:
            thread.join()
            
            
    def fix_profiles(self) -> None:
        profiles: list[str] = self.get_available_temp_profiles()
        
        threads: list[Thread] = []
        for profile in profiles:
            thread: Thread = Thread(target=self.__create_profile, args=(profile,True))
            threads.append(thread)
            thread.start()
            
        for thread in threads:
            thread.join()

__all__: list[str] = ["Profiles"]