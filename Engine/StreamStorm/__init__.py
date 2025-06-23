from logging import CRITICAL, basicConfig
from os import environ
from threading import Event

environ["PAUSE"] = "False"
environ["BUSY"] = "False"
environ["BUSY_REASON"] = ""

environ["mode"] = "mt"

pause_event_mt: Event = Event()

# import os
# print(os.path.dirname(os.path.abspath(__file__)))

basicConfig(level=CRITICAL, force=True)