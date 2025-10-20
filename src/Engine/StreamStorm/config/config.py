from pathlib import Path
ROOT: Path = Path(__file__).parent.parent.parent.parent.parent.resolve()

CONFIG: dict = {
    "ENV": "production", # Valid values: ["development", "production", "test"]
    "VERSION": "3.4.8",
    "ROOT": ROOT
}

__all__: list[str] = ["CONFIG"]