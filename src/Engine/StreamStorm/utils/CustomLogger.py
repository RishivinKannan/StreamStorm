from logging import Formatter, Logger, getLogger, DEBUG, INFO, FileHandler, StreamHandler, NullHandler, Handler  # noqa: F401
from logging.handlers import QueueHandler, QueueListener
from platformdirs import user_data_dir
from pathlib import Path
from queue import Queue
from rich.logging import RichHandler
from atexit import register as atexit_register

from .GetIstTime import get_ist_time
from ..config import CONFIG
from ..api.validation import StormData

class CustomLogger:
    __slots__: tuple[str, ...] = ('logging_dir', 'logger', 'queue_handler')
    
    log_queue: Queue = Queue(-1)
    listener: QueueListener | None = None
    
    def __init__(self, for_history: bool = False) -> None:
        self.logging_dir: Path = Path(user_data_dir("StreamStorm", "DarkGlance")) / "logs"
        self.logging_dir.mkdir(parents=True, exist_ok=True)
        
        if not for_history:
            self.queue_handler: Handler = QueueHandler(self.log_queue)
            
            CustomLogger.listener = QueueListener(self.log_queue, self.__get_console_handler(), self.__get_file_handler())
            CustomLogger.listener.start()
        
            atexit_register(CustomLogger.listener.stop)

    def __get_console_handler(self) -> Handler:
        
        env: str = CONFIG.get("ENV")
        handler: Handler = NullHandler()

        if env == "development":
            handler = RichHandler(
                rich_tracebacks=True,
                markup=False,
                show_time=True,
                show_path=True,
                show_level=True,
                enable_link_path=True
            )

        return handler
    
    def __get_file_handler(self) -> FileHandler:       
        # sourcery skip: class-extract-method
        
        log_file: Path = self.__touch_log_file(f"log - {get_ist_time()}.log")

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
    
    def __setup_logging(self, name: str) -> None:
        
        logger: Logger = getLogger(name)
        logger.setLevel(DEBUG)
        logger.addHandler(self.queue_handler)
        logger.propagate = False
        
    def __touch_log_file(self, file_name) -> Path:
        
        log_file: Path = self.logging_dir / file_name
        log_file.touch(exist_ok=True)
        
        return log_file

    def setup_streamstorm_logging(self) -> None:
        
        self.__setup_logging("streamstorm")

    def setup_fastapi_logging(self) -> None:

        self.__setup_logging("fastapi")

    def setup_history_logger(self) -> None:

        log_file: Path = self.__touch_log_file("History.log")
        
        formatter: Formatter = Formatter(
            "============================================================\n%(message)s"
        )
        
        handler: FileHandler = FileHandler(
            log_file,
            mode="a",
            encoding="utf-8"
        )
        
        handler.setFormatter(formatter)
        
        logger: Logger = getLogger("history")
        logger.setLevel(INFO)
        logger.addHandler(handler)
        logger.propagate = False
        
    def log_to_history(self, data: StormData, remarks: str = "No remarks") -> None:
        if CONFIG.get("ENV") == "test":
            return
        
        logger: Logger = getLogger("history")
        
        date_time: str = get_ist_time()
        
        message_str: str = "\n".join([f"{k}: {v}" for k, v in data.__dict__.items()]) + f"\n\nRemarks: {remarks}\n"
              
        message_str = f"Date Time: {date_time}\n\n{message_str}\n"
        
        logger.info(message_str)