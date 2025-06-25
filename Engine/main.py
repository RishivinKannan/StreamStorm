from os import environ
from traceback import print_exc
from typing import Optional
from flask import Flask, Response, request, jsonify
from flask_cors import CORS
from psutil import virtual_memory
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
from threading import Thread
from waitress import serve

# from multiprocessing import Manager
# from multiprocessing.managers import SyncManager

from StreamStorm.StreamStorm import StreamStorm
from StreamStorm.Profiles import Profiles
from StreamStorm.Validation import StormDataValidation, ProfileDataValidation, ChangeMessagesDataValidation, ChangeSlowModeDataValidation
from StreamStorm import pause_event_mt


app: Flask = Flask(__name__)
CORS(app)

# manager: SyncManager = Manager()
# shared_data: dict = manager.dict()

@app.before_request
def before_request() -> Optional[Response]:    

    if request.method == "POST":
        if request.path in ("/storm", "/create_profiles", "/delete_all_profiles", ):
            if environ["BUSY"] == "True":
                return jsonify({"success": False, "message": f"Engine is Busy: {environ['BUSY_REASON']}"})
            
        if request.path in ('/create_profiles', '/delete_all_profiles'):
            request.validated_data = ProfileDataValidation(**request.json).model_dump()


@app.route("/storm", methods=["POST"])
def storm() -> Response:
    pause_event_mt.set() # Ensure the pause event is set to allow storming

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
        
        StreamStormObj.ready_event.clear()  # Clear the ready event to ensure it will be only set when all instances are ready

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

    pause_event_mt.set() # Ensure the pause event is set to allow next storms
    environ["BUSY"] = "False"

    return jsonify({"success": True, "message": "Stopped"})


@app.route("/pause", methods=["POST"])
def pause() -> Response:
    pause_event_mt.clear() # Clear the pause event to pause storming

    return jsonify({"success": True, "message": "Paused"})


@app.route("/resume", methods=["POST"])
def resume() -> Response:
    pause_event_mt.set() # Set the pause event to resume storming

    return jsonify({"success": True, "message": "Resumed"})


@app.route("/change_messages", methods=["POST"])
def change_messages() -> Response:
    
    data: dict[str, list[str]] = ChangeMessagesDataValidation(**request.json).model_dump()
    StreamStorm.ss_instance.messages = data["messages"]

    return jsonify({"success": True, "message": "Messages changed successfully"})

@app.route("/start_storm_dont_wait", methods=["POST"])
def start_storm_dont_wait() -> Response:
    StreamStorm.ss_instance.ready_event.set()  # Set the event to signal that don't wait for the remaining instances to be ready, and start storming immediately.
    
    return jsonify({"success": True, "message": "Storm started without waiting for all instances to be ready"})

@app.route("/change_slow_mode", methods=["POST"])
def change_slow_mode() -> Response:
    data: dict[str, int] = ChangeSlowModeDataValidation(**request.json).model_dump()
    
    if not StreamStorm.ss_instance.ready_event.is_set():
        return jsonify({"success": False, "message": "Cannot change slow mode before the storm starts"})
    
    StreamStorm.ss_instance.slow_mode = data["slow_mode"]
    
    return jsonify({"success": True, "message": "Slow mode changed successfully"})
    

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
def delete_all_profiles() -> Response:
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

def run_flask_app() -> None:
    """
    Run the Flask application.
    This function is used to run the Flask app in a separate thread.
    """
    serve(app, host="0.0.0.0", port=5000)


if __name__ == "__main__":
    from dgupdater import check_update
    check_update()
    from sys import argv
    from os import kill, getpid
    from signal import SIGTERM
    from os.path import dirname, abspath, join
    from webview import create_window, start    
    
    
    environ["rammap_path"] = join(dirname(abspath(__file__)), "RAMMap.exe")
    
    if len(argv) > 1:
        if argv[1] == "--mt":
            environ["mode"] = "mt"
        elif argv[1] == "--mp":
            environ["mode"] = "mp"
    
    Thread(target=run_flask_app, daemon=True).start()
    
    try: 
        create_window(
            title="StreamStorm",
            url="https://streamstorm-ui.netlify.app/",
            width=1300,
            height=900,
            confirm_close=True
        )
        
        start()
    finally:
        # Ensure the Flask app is stopped when the webview is closed
        kill(getpid(), SIGTERM)
