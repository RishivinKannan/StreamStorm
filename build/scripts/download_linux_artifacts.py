from subprocess import run, CompletedProcess
import json
from logging import basicConfig, INFO, info as log_info

basicConfig(level=INFO)

def get_latest_run_id() -> str:
    
    cmd: list[str] = [
        "gh", "run", "list",
        "--workflow", "linux-build.yml",
        "--repo", "Ashif4354/StreamStorm",
        "--limit", "1",
        "--json", "databaseId"
    ]

    result: CompletedProcess[str] = run(cmd, capture_output=True, text=True, check=True)
    
    if data := json.loads(result.stdout):
        log_info("Latest run id: %s", data[0]["databaseId"])
        return data[0]["databaseId"]
    
    else:
        raise RuntimeError("Bruh, No runs found")


def download_run_artifacts(run_id) -> None:
    
    cmd: list[str] = [
        "gh", "run", "download",
        str(run_id),
        "--repo", "Ashif4354/StreamStorm",
        "--dir", "./native-builds"
    ]

    run(cmd, check=True)
    log_info("Artifacts downloaded")


if __name__ == "__main__":
    run_id: str = get_latest_run_id()
    download_run_artifacts(run_id)
