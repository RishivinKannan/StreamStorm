from logging import CRITICAL, basicConfig
from os import environ
from threading import Event

environ["PAUSE"] = "False"
environ["BUSY"] = "False"
environ["BUSY_REASON"] = ""

environ["mode"] = "mt"

pause_event: Event = Event()


basicConfig(level=CRITICAL, force=True)