from os import environ
from subprocess import Popen

from logging import getLogger, Logger

logger: Logger = getLogger(f"streamstorm.{__name__}")

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
        logger.error("RAMMap.exe not found!")
    except PermissionError:
        logger.error("Permission denied while trying to run RAMMap.exe.")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")


__all__: list[str] = ["clear_ram"]