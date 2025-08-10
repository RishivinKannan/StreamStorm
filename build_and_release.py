from subprocess import call, run
from os import chdir
from pathlib import Path
from shutil import move, rmtree, which
from tomlkit import TOMLDocument, parse, dumps
from json import dump, load
from re import sub
from logging import basicConfig, INFO, info

basicConfig(level=INFO)

ROOT: Path = Path(__file__).parent.resolve()
info(f"Root directory: {ROOT}")

def update_versions(new_version: str) -> None:
    
    # Engine/pyproject.toml
    pyproject_toml_path: Path = ROOT / "Engine" / "pyproject.toml"
    
    with open(pyproject_toml_path, "r") as f:
        pyproject_data: TOMLDocument = parse(f.read())
        
    pyproject_data["project"]["version"] = new_version
    
    with open(pyproject_toml_path, "w") as f:
        f.write(dumps(pyproject_data))

    # UI/package.json
    package_json_path: Path = ROOT / "UI" / "package.json"

    with open(package_json_path, "r") as f:
        package_data: dict = load(f)

    package_data["version"] = new_version

    with open(package_json_path, "w") as f:
        dump(package_data, f, indent=4)
        
    # Site/package.json
    site_package_json_path: Path = ROOT / "Site" / "package.json"

    with open(site_package_json_path, "r") as f:
        site_data: dict = load(f)

    site_data["version"] = new_version

    with open(site_package_json_path, "w") as f:
        dump(site_data, f, indent=4)

    # INNO Setup / create_setup.iss
    create_setup_iss: Path = ROOT / "INNO Setup" / "create_setup.iss"
    text: str = create_setup_iss.read_text(encoding="utf-8")
    text = sub(r'#define MyAppVersion\s+".*"', f'#define MyAppVersion "{new_version}"', text)
    create_setup_iss.write_text(text, encoding="utf-8")


def generate_exe() -> None:
    chdir(ROOT / "Engine")
    call("uv sync", shell=True)
    chdir(ROOT)
    
    icon_path: Path = ROOT / "UI" / "public" / "favicon.ico"
    rammap_path: Path = ROOT / "Engine" / "RAMMap.exe"
    main_path: Path = ROOT / "Engine" / "main.py"

    build_command: str = ([
        "pyinstaller",
        "--noconfirm",
        "--onefile",
        "--windowed",
        f"--icon={icon_path}",
        "--name=StreamStorm",
        "--contents-directory=data",
        "--clean",
        "--uac-admin",
        f"--add-data={rammap_path};.",
        str(main_path)
    ])

    call(build_command)
    
    dist_dir: Path = ROOT / "dist"    
    exe_path: Path = dist_dir / "StreamStorm.exe"
    output_dir: Path = ROOT / "output"
    
    target_path: Path = output_dir / "StreamStorm.exe"
    
    if exe_path.exists():
        if target_path.exists():
            target_path.unlink()
        move(str(exe_path), str(output_dir))
    else:
        raise FileNotFoundError("Built .exe file not found")
    
    build_dir: Path = ROOT / "build"
    rmtree(dist_dir, ignore_errors=True)
    rmtree(build_dir, ignore_errors=True)
    
def generate_setup_file() -> None:
    if not which("ISCC"):
        raise EnvironmentError("Inno Setup Compiler (ISCC) not found. Install or add it to PATH.")
    
    chdir(ROOT / "INNO Setup")
    call("ISCC create_setup.iss", shell=True)
    
def build_SITE() -> None:
    chdir(ROOT / "Site")
    call("vite build", shell=True)
    chdir(ROOT)

def build_UI() -> None:
    chdir(ROOT / "UI")
    call("vite build", shell=True)
    chdir(ROOT)

def firebase_deploy() -> None:
    chdir(ROOT)
    call("firebase deploy", shell=True)

def dgupdater_commit_and_publish(new_version: str) -> None:
    chdir(ROOT / "output")
    run(f"dgupdater commit -v {new_version}", shell=True, check=True)
    call("dgupdater publish", shell=True)
    
def main() -> None:
    new_version: str = input("Enter the new version: ")

    update_versions(new_version)
    generate_exe()
    generate_setup_file()
    build_SITE()
    build_UI()
    firebase_deploy()
    dgupdater_commit_and_publish(new_version)


if __name__ == "__main__":
    main()