from os import environ, system
from typing import Optional
from threading import Thread
from flask import Flask, Response, send_from_directory, request, jsonify
from flask_cors import CORS
from psutil import virtual_memory

from StreamStorm.StreamStorm import StreamStorm
from StreamStorm.Profiles import Profiles
from StreamStorm.Validation import StormDataValidation, ProfileDataValidation


app: Flask = Flask(__name__, static_folder="../UI/dist", static_url_path="/")
CORS(app)

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
    def close_browser() -> None:
        try:
            instance.driver.close()
        except Exception:
            pass

    threads: list[Thread] = []
    for instance in StreamStorm.each_instances:
        thread: Thread = Thread(target=close_browser)
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    environ["PAUSE"] = "False"
    environ["BUSY"] = "False"

    return jsonify({"success": True, "message": "Stopped"})


@app.route("/pause", methods=["POST"])
def pause() -> Response:
    environ["PAUSE"] = "True"

    return jsonify({"success": True, "message": "Paused"})


@app.route("/resume", methods=["POST"])
def resume() -> Response:
    environ["PAUSE"] = "False"

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


@app.route("/fix_profiles", methods=["POST"])
def fix_profiles() -> Response:
    try:
        environ["BUSY"] = "True"
        environ["BUSY_REASON"] = "Fixing profiles"

        profiles: Profiles = Profiles(request.validated_data["browser_class"])
        profiles.fix_profiles()

        return jsonify({"success": True, "message": "Profiles fixed"})
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

@app.route("/current_status", methods=["GET"])
def status() -> Response:
    return jsonify(
        {
            "busy": environ.get("BUSY", "False") == "True",
            "busy_reason": environ.get("BUSY_REASON", ""),
            "pause": environ.get("PAUSE", "False") == "True",
        }
    )
    
    
@app.route("/create_environment", methods=["POST"])
def create_environment() -> Response:
    ...
    



__all__: list[str] = ["app"]


if __name__ == "__main__":
    
    system('cls')
    
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False,
    )
