from os import environ, system
from os.path import dirname, abspath, join
from traceback import print_exc
from typing import Optional
from flask import Flask, Response, send_from_directory, request, jsonify
from flask_cors import CORS
from psutil import virtual_memory
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
# from multiprocessing import Manager
# from multiprocessing.managers import SyncManager

from StreamStorm.StreamStorm import StreamStorm
from StreamStorm.Profiles import Profiles
from StreamStorm.Validation import StormDataValidation, ProfileDataValidation, ChangeMessagesDataValidation
from StreamStorm import pause_event_mt


app: Flask = Flask(__name__, static_folder="../UI/dist", static_url_path="/")
CORS(app)

# manager: SyncManager = Manager()
# shared_data: dict = manager.dict()

@app.before_request
def before_request() -> Optional[Response]:
    if request.path not in ("/", "/stop", "/get_available_ram", "/pause", "/resume", "/current_status", '/change_messages'):
        if environ["BUSY"] == "True":
            return jsonify({"success": False, "message": f"Engine is Busy: {environ['BUSY_REASON']}"})

    if request.method == "POST":
        if request.path in ('/create_profiles', '/delete_profiles', '/fix_profiles', '/delete_all_profiles'):
            request.validated_data = ProfileDataValidation(**request.json).model_dump()
            
        if request.path in ('/change_messages',):
            print("Validating change messages data")
            request.validated_data = ChangeMessagesDataValidation(**request.json).model_dump()
            print("Change messages data validated successfully", request.validated_data)



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

    StreamStorm.each_account_instances = []

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
        print_exc()
        environ["BUSY"] = "False"        
        return jsonify({"success": False, "message": str(e)})


@app.route("/stop", methods=["POST"])
def stop() -> Response:
    def close_browser(instance: StreamStorm) -> None:
        try:
            if instance.driver:
                instance.driver.close()
        except Exception:
            pass
        
    if environ["mode"] == "mt":
        with ThreadPoolExecutor() as executor:
            executor.map(close_browser, StreamStorm.each_account_instances)
    elif environ["mode"] == "mp":
        with ProcessPoolExecutor() as executor:
            executor.map(close_browser, StreamStorm.each_account_instances)

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


@app.route("/change_messages", methods=["POST"])
def change_messages() -> Response:
    
    StreamStorm.ss_instance.messages = request.validated_data["messages"]
    
    return jsonify({"success": True, "message": "Messages changed successfully"})

@app.route("/start_storm_dont_wait", methods=["POST"])
def start_storm_dont_wait() -> Response:
    StreamStorm.ss_instance.ready_event.set()  # Set the event to signal that don't wait for the remaining instances to be ready, and start storming immediately.
    
    return jsonify({"success": True, "message": "Storm started without waiting for all instances to be ready"})

@app.route("/create_profiles", methods=["POST"])
def create_profiles() -> Response:

    try:
        environ["BUSY"] = "True"
        environ["BUSY_REASON"] = "Creating profiles"

        profiles: Profiles = Profiles(request.validated_data["browser_class"])
        profiles.create_profiles(request.validated_data["limit"])

        return jsonify({"success": True, "message": "Profiles created"})
    except Exception as e:
        print_exc()
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
        print_exc()
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
    environ["rammap_path"] = join(dirname(abspath(__file__)), "RAMMap.exe")
    
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
