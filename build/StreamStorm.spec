# -*- mode: python ; coding: utf-8 -*-
from pathlib import Path
from os import getcwd

ROOT = Path(getcwd()).parent.resolve()
ENGINE = ROOT / "src" / "Engine"
UI = ROOT / "src" / "UI"

a = Analysis(
    [str(ENGINE / "main.py")],
    pathex=[str(ROOT)],
    binaries=[],
    datas=[(str(ENGINE / "RAMMap.exe"), ".")],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name="StreamStorm",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,                 # = --windowed
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    uac_admin=True,                # = --uac-admin
    icon=[str(UI / "public" / "favicon.ico")],   # = --icon
    contents_directory="data",     # = --contents-directory=data
)