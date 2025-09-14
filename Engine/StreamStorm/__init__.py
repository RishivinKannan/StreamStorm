from sys import path
from pathlib import Path
path.insert(0, str(Path(__file__).parent.parent.parent.resolve()))


from os import environ

from .api.fastapi_app import app

environ.update({"BUSY": "0"})
environ.update({"BUSY_REASON": ""})

__all__: list[str] = ['app']

