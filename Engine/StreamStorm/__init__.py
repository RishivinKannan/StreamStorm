from logging import CRITICAL, basicConfig
from os import environ

environ.update({"BUSY": "0"})
environ.update({"BUSY_REASON": ""})


# basicConfig(level=CRITICAL, force=True)