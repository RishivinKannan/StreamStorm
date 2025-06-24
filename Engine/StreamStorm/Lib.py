from os import environ
from subprocess import Popen

def clear_ram() -> None:
    rammap_path: str = environ.get("rammap_path")
    if not rammap_path:
        raise EnvironmentError("RAMMap path is not set in the environment variables.")
    
    try:
        Popen(
            [
                rammap_path,
                "-Ew",
                # "-Es",
                # "-Em",
                # "-Et",
                # "-E0",            
            ],
            shell=False,
            stdout=None,
            stderr=None,
        )
    except FileNotFoundError:
        print("💥 RAMMap.exe not found!")
    except PermissionError:
        print("🔒 Permission denied while trying to run RAMMap.exe.")
    except Exception as e:
        print(f"😵 Unexpected error: {e}")