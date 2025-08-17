from typing import NoReturn
from asyncio import sleep
from ..StreamStorm import StreamStorm

async def background_storm_stopper() -> NoReturn:
    while True:
        await sleep(5)
        if StreamStorm.ss_instance is None:
            continue
        
        statuses: list[bool] = [await instance.is_instance_alive() for instance in StreamStorm.each_channel_instances.copy()]
        
        if len(statuses) == 0:
            print("StreamStorm instance is marked dead by: No instances alive")
            
        if not any(statuses):
            StreamStorm.ss_instance = None
            StreamStorm.each_channel_instances.clear()

__all__: list[str] = ["background_storm_stopper"]