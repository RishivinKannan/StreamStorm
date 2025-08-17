from logging import Formatter, Logger, getLogger, DEBUG, FileHandler, StreamHandler
from logging.handlers import QueueHandler, QueueListener
from typing import TextIO
from platformdirs import user_data_dir
from pathlib import Path
from queue import Queue
from rich.logging import RichHandler
from atexit import register as atexit_register

from .GetIstTime import get_ist_time

class CustomLogger:
    log_queue: Queue = Queue(-1)
    listener: QueueListener | None = None
    
    def __init__(self):
        self.logging_dir: Path = Path(user_data_dir("StreamStorm", "DarkGlance")) / "logs"

    def get_console_handler(self) -> RichHandler:

        handler: RichHandler = RichHandler(
            rich_tracebacks=True,
            markup=True,
            show_time=True,
            show_path=True,
            show_level=True,
            enable_link_path=True
        )
        
        # formatter = Formatter(
        #     "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
        #     datefmt="%m/%d/%y %H:%M:%S"
        # )

        # handler: StreamHandler = StreamHandler()
        # handler.setFormatter(formatter)
        
        return handler
    
    def get_file_handler(self) -> FileHandler:
        
        self.logging_dir.mkdir(parents=True, exist_ok=True)
        
        log_file: Path = self.logging_dir / f"StreamStorm_logs - {get_ist_time()}.log"
        log_file.touch(exist_ok=True)

        file_formatter: Formatter = Formatter(
            "%(asctime)s [%(name)s: %(lineno)d] %(levelname)s: %(message)s"
        )
        
        handler: FileHandler = FileHandler(
            log_file,
            mode="a",
            encoding="utf-8"
        )
        
        handler.setFormatter(file_formatter)
        
        return handler

    def setup_logging(self) -> None:
        queue_handler = QueueHandler(self.log_queue)
        
        self.logger: Logger = getLogger("streamstorm")
        self.logger.setLevel(DEBUG)
        self.logger.addHandler(queue_handler)
        self.logger.propagate = False

        CustomLogger.listener = QueueListener(self.log_queue, self.get_console_handler(), self.get_file_handler())
        CustomLogger.listener.start()
        
        atexit_register(CustomLogger.listener.stop)


