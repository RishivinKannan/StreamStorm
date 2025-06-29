from logging import CRITICAL, basicConfig
from os import environ
from threading import Event

environ["PAUSE"] = "False"
environ["BUSY"] = "False"
environ["BUSY_REASON"] = ""

environ["mode"] = "mt"

# basicConfig(level=CRITICAL, force=True)