from typing import NoReturn
from asyncio import sleep
from logging import getLogger, Logger

from ...core.StreamStorm import StreamStorm

logger: Logger = getLogger("streamstorm." + __name__)

async def background_storm_stopper() -> NoReturn:
    while True:
        await sleep(5)
        if StreamStorm.ss_instance is None:
            continue
        
        statuses: list[bool] = [await instance.is_instance_alive() for instance in StreamStorm.each_channel_instances.copy()]
        
        if len(statuses) == 0:
            logger.info("StreamStorm instance is marked dead by: Status length checker")

        if not any(statuses):
            StreamStorm.ss_instance = None
            StreamStorm.each_channel_instances.clear()

__all__: list[str] = ["background_storm_stopper"]