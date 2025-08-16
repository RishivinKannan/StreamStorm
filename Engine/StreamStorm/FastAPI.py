from os import environ
from os.path import join, exists
from json import load
from psutil import virtual_memory

from platformdirs import user_data_dir

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware

from asyncio import gather

from .StreamStorm import StreamStorm
from .Profiles import Profiles
from .Validation import (
    StormData,
    ProfileData,
    ChangeMessagesData,
    ChangeSlowModeData,
    StartMoreChannelsData,
    GetChannelsData,
)
from .FastApiLib.exception_handlers import (
    common_exception_handler,
    validation_exception_handler,
)
from.FastApiLib.LifeSpan import lifespan

app: FastAPI = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.exception_handlers = {
    Exception: common_exception_handler,
    HTTPException: common_exception_handler,
    SystemError: common_exception_handler,
    RuntimeError: common_exception_handler,
    RequestValidationError: validation_exception_handler,
}

storm_controls_endpoints: list[str] = [
    "/pause",
    "/resume",
    "/change_messages",
    "/start_storm_dont_wait",
    "/change_slow_mode",
    "/start_more_channels",
]

@app.middleware("http")
async def validate_request(request: Request, call_next) -> JSONResponse:
    path: str = request.url.path
    method: str = request.method
    
    cors_headers: dict[str, str] = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
    }

    if method == "POST":
        if path in (
            "/storm",
            "/create_profiles",
            "/delete_all_profiles",
        ):
            if environ.get("BUSY") == "1":
                return JSONResponse(
                    status_code=429,
                    content={
                        "success": False,
                        "message": f"Engine is Busy: {environ.get('BUSY_REASON')}",
                    },
                    headers=cors_headers,
                )

        if path in storm_controls_endpoints:
            if StreamStorm.ss_instance is None:
                return JSONResponse(
                    status_code=409,
                    content={
                        "success": False,
                        "message": "No storm is running. Start a storm first.",
                    },
                    headers=cors_headers,
                )

    if method == "GET":
        if path in storm_controls_endpoints:
            if StreamStorm.ss_instance is None:
                return JSONResponse(
                    status_code=409,
                    content={
                        "success": False,
                        "message": "No storm is running. Start a storm first.",
                    },
                    headers=cors_headers,
                )

    response: JSONResponse = await call_next(request)

    return response



@app.get("/")
async def root() -> dict[str, str]:
    return {
        "message": "Hello World"
    }


@app.post("/storm")
async def storm(data: StormData):
    if StreamStorm.ss_instance is not None:
        
        return {
            "success": False,
            "message": "A storm is already running. Stop the current storm before starting a new one.",
        }

    StreamStorm.each_channel_instances = []

    StreamStormObj: StreamStorm = StreamStorm(
        data.video_url,
        data.chat_url,
        data.messages,
        (data.subscribe, data.subscribe_and_wait),
        data.subscribe_and_wait_time,
        data.slow_mode,
        data.channels,
        data.background,
    )

    StreamStormObj.ready_event.clear()  # Clear the ready event to ensure it will be only set when all instances are ready
    StreamStormObj.pause_event.set()  # Set the pause event to allow storming to start immediately

    environ.update({"BUSY": "1", "BUSY_REASON": "Storming in progress"})

    try:
        await StreamStormObj.start()
    except SystemError as e:
        environ.update({"BUSY": "0", "BUSY_REASON": ""})
        StreamStorm.ss_instance = None
        raise e

    return {
        "success": True,
        "message": "Storm started successfully"
    }


@app.post("/stop")
async def stop():
    async def close_browser(instance: StreamStorm) -> None:
        try:
            if instance.page:
                await instance.page.close()
        except Exception:
            pass # log.warn

    await gather(*(close_browser(i) for i in StreamStorm.each_channel_instances))

    StreamStorm.ss_instance = None

    environ.update({"BUSY": "0"})

    return {
        "success": True, 
        "message": "Storm stopped successfully"
    }


@app.post("/pause")
async def pause():
    StreamStorm.ss_instance.pause_event.clear()

    return {
        "success": True,
        "message": "Storm paused successfully"
    }


@app.post("/resume")
async def resume():
    StreamStorm.ss_instance.pause_event.set()

    return {
        "success": True,
        "message": "Storm resumed successfully"
    }


@app.post("/change_messages")
async def change_messages(data: ChangeMessagesData):
    await StreamStorm.ss_instance.set_messages(data.messages)

    return {
        "success": True,
        "message": "Messages changed successfully"
    }


@app.post("/start_storm_dont_wait")
async def start_storm_dont_wait():
    StreamStorm.ss_instance.ready_event.set()

    return {
        "success": True,
        "message": "Storm started without waiting for all instances to be ready",
    }


@app.post("/change_slow_mode")
async def change_slow_mode(data: ChangeSlowModeData):
    if not StreamStorm.ss_instance.ready_event.is_set():
        return {
                "success": False,
                "message": "Cannot change slow mode before the storm starts",
            }

    await StreamStorm.ss_instance.set_slow_mode(data.slow_mode)

    return {
        "success": True, 
        "message": "Slow mode changed successfully"
    }


@app.post("/start_more_channels")
async def start_more_channels(data: StartMoreChannelsData):
    if not StreamStorm.ss_instance.ready_event.is_set():
        return {
            "success": False,
            "message": "Cannot start more channels before the storm starts",
        }

    await StreamStorm.ss_instance.start_more_channels(data.channels)

    return {
        "success": True, 
        "message": "More channels started successfully"
    }
    
    
@app.post("/get_channels_data")
async def get_channels_data(data: GetChannelsData):
    mode: str = data.mode

    if mode == "add" and StreamStorm.ss_instance is None:
        return {
            "success": False,
            "message": "No storm is running. Start a storm first.",
        }

    app_data_dir: str = user_data_dir("StreamStorm", "DarkGlance")
    config_json_path: str = join(app_data_dir, "ChromiumProfiles", "config.json")

    if not exists(config_json_path):
        return {
            "success": False,
            "message": "Config file not found. Create profiles first.",
        }

    with open(config_json_path, "r") as file:
        config: dict = load(file)

    response_data: dict = {}

    if mode == "new":
        response_data["channels"] = config["channels"]
        response_data["activeChannels"] = []

    elif mode == "add":
        active_channels: list[str] = await StreamStorm.ss_instance.get_active_channels()

        response_data["channels"] = config["channels"]
        response_data["activeChannels"] = active_channels

    response_data.update({"success": True})

    return response_data


@app.post("/create_profiles")
async def create_profiles(data: ProfileData):
    environ.update({"BUSY": "1", "BUSY_REASON": "Creating profiles"})

    profiles: Profiles = Profiles()
    try:
        await run_in_threadpool(profiles.create_profiles, data.count)
    finally:
        environ.update({"BUSY": "0", "BUSY_REASON": ""})

    return {
        "success": True, 
        "message": "Profiles created successfully"
    }
    
@app.post("/delete_all_profiles")
async def delete_all_profiles(data: ProfileData):
    environ.update({"BUSY": "1", "BUSY_REASON": "Deleting profiles"})

    profiles: Profiles = Profiles()

    try:
        await run_in_threadpool(profiles.delete_all_temp_profiles)
    finally:
        environ.update({"BUSY": "0", "BUSY_REASON": ""})

    return {
        "success": True,
        "message": "Profiles deleted successfully"
    }
    
@app.get("/get_ram_info")
async def get_ram_info():
    return {
        "free": virtual_memory().available / (1024**3),
        "total": virtual_memory().total / (1024**3),
    }
    
@app.get("/engine-status")
async def status():
    response: dict = {}

    if StreamStorm.ss_instance is not None:
        response["storm_in_progress"] = True
    else:
        response["storm_in_progress"] = False

    return response
    

__all__: list[str] = ["app"]