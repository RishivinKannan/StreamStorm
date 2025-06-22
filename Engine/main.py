from os import environ, system
from typing import Optional
from flask import Flask, Response, send_from_directory, request, jsonify
from flask_cors import CORS
from psutil import virtual_memory
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
# from multiprocessing import Manager
# from multiprocessing.managers import SyncManager

from StreamStorm.StreamStorm import StreamStorm
from StreamStorm.Profiles import Profiles
from StreamStorm.Validation import StormDataValidation, ProfileDataValidation
from StreamStorm import pause_event_mt


app: Flask = Flask(__name__, static_folder="../UI/dist", static_url_path="/")
CORS(app)

# manager: SyncManager = Manager()
# shared_data: dict = manager.dict()

@app.before_request
def before_request() -> Optional[Response]:
    if request.path not in ("/", "/stop", "/get_available_ram", "/pause", "/resume", "/current_status"):
        if environ["BUSY"] == "True":
            return jsonify({"success": False, "message": f"Engine is Busy: {environ['BUSY_REASON']}"})

    if request.method == "POST":
        if request.path in ('/create_profiles', '/delete_profiles', '/fix_profiles', '/delete_all_profiles'):
            request.validated_data = ProfileDataValidation(**request.json).model_dump()



@app.route("/")
def home() -> Response:
    return send_from_directory(app.static_folder, "index.html")


@app.route("/storm", methods=["POST"])
def storm() -> Response:
    pause_event_mt.set() # Ensure the pause event is set to allow storming
    environ["PAUSE"] = "False"

    data: dict = request.json

    try:
        data = StormDataValidation(**data).model_dump()
    except ValueError as e:
        errors: list = e.errors()
        if "ctx" in errors[0]:
            del errors[0]["ctx"]
        return jsonify({"success": False, "message": errors})

    StreamStorm.each_instances = []

    try:
        StreamStormObj: StreamStorm = StreamStorm(
            data["video_url"],
            data["chat_url"],
            data["messages"],
            (data["subscribe"], data["subscribe_and_wait"]),
            data["subscribe_and_wait_time"],
            data["slow_mode"],
            data["start_account_index"],
            data["end_account_index"],
            data["browser"],
            data["background"],
            # shared_data=shared_data, # Uncomment this line if using shared data
        )

        environ["BUSY"] = "True"
        environ["BUSY_REASON"] = "Storming in progress"

        StreamStormObj.start()

        return jsonify({"success": True, "message": "Started"})
       
    except Exception as e:
        environ["BUSY"] = "False"
        return jsonify({"success": False, "message": str(e)})


@app.route("/stop", methods=["POST"])
def stop() -> Response:
    def close_browser(instance: StreamStorm) -> None:
        try:
            instance.driver.close()
        except Exception:
            pass
        
    if environ["mode"] == "mt":
        with ThreadPoolExecutor() as executor:
            executor.map(close_browser, StreamStorm.each_instances)
    elif environ["mode"] == "mp":
        with ProcessPoolExecutor() as executor:
            executor.map(close_browser, StreamStorm.each_instances)

    pause_event_mt.set() # Ensure the pause event is set to allow storming
    environ["PAUSE"] = "False"
    environ["BUSY"] = "False"

    return jsonify({"success": True, "message": "Stopped"})


@app.route("/pause", methods=["POST"])
def pause() -> Response:
    environ["PAUSE"] = "True"
    pause_event_mt.clear() # Clear the pause event to pause storming

    return jsonify({"success": True, "message": "Paused"})


@app.route("/resume", methods=["POST"])
def resume() -> Response:
    environ["PAUSE"] = "False"
    pause_event_mt.set() # Set the pause event to resume storming

    return jsonify({"success": True, "message": "Resumed"})


@app.route("/create_profiles", methods=["POST"])
def create_profiles() -> Response:

    try:
        environ["BUSY"] = "True"
        environ["BUSY_REASON"] = "Creating profiles"

        profiles: Profiles = Profiles(request.validated_data["browser_class"])
        profiles.create_profiles(request.validated_data["limit"])

        return jsonify({"success": True, "message": "Profiles created"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
    finally:
        environ["BUSY"] = "False"


@app.route("/delete_all_profiles", methods=["POST"])
def delete_profiles() -> Response:
    try:
        environ["BUSY"] = "True"
        environ["BUSY_REASON"] = "Deleting profiles"

        profiles: Profiles = Profiles(request.validated_data["browser_class"])
        profiles.delete_all_temp_profiles()

        return jsonify({"success": True, "message": "Profiles deleted"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
    finally:
        environ["BUSY"] = "False"

@app.route("/get_ram_info", methods=["GET"])
def get_ram_info() -> Response:
    print(virtual_memory())
    return jsonify(
        {
            "free": virtual_memory().available / (1024**3),
            "total": virtual_memory().total / (1024**3),
        }
    )

__all__: list[str] = ["app"]


if __name__ == "__main__":
    from sys import argv
    
    if len(argv) > 1:
        if argv[1] == "--mt":
            environ["mode"] = "mt"
        elif argv[1] == "--mp":
            environ["mode"] = "mp"

    system('cls')
    
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False,
    )
