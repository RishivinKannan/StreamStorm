# StreamStorm - Personal Use Only
# Copyright (c) 2025 Ashif (DarkGlance)
# Licensed under the StreamStorm Personal Use License
# See LICENSE file or visit: https://github.com/Ashif4354/StreamStorm
# Unauthorized Redistribution or Commercial Use is Prohibited

from dgupdater import check_update
from os import kill, getpid, environ
from signal import SIGTERM
from os.path import dirname, abspath, join
from webview import create_window, start
from threading import Thread
from uvicorn import run as run_uvicorn
from logging import Logger, getLogger

from StreamStorm import app
from StreamStorm.utils.CustomLogger import CustomLogger


CustomLogger().setup_logging()

logger: Logger = getLogger("streamstorm." + __name__)

def serve_api() -> None:
    run_uvicorn(
        app, 
        host="0.0.0.0", 
        port=1919, # 1919, because 19 is the character number for "S" in the English alphabets.
        log_level="warning"
    ) 

def set_rammap_path() -> None:
    environ.update({"rammap_path": join(dirname(abspath(__file__)), "RAMMap.exe")})
    logger.info(f"RAMMap path set to: {environ['rammap_path']}")

def main() -> None:
    
    check_update()   

    set_rammap_path()

    Thread(target=serve_api, daemon=True).start()
    logger.info("API server started.")

    try:
        create_window(
            title="StreamStorm",
            url="https://streamstorm-ui.web.app/",
            # url="http://localhost:5173", # Local development URL
            width=1300,
            height=900,
            confirm_close=True,
        )
        logger.info("Webview created.")
        start()
    finally:
        # Ensure the API is stopped when the webview is closed
        logger.info("Webview closed, stopping API server.")
        kill(getpid(), SIGTERM)
        
        
if __name__ == "__main__":
    main()
    
