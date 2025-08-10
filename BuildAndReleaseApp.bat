cd Engine
uv sync
call .venv/Scripts/activate
cd..

call auto-py-to-exe -c apte-ss-config.json

@REM Make sure Inno Setup is installed and ISCC.exe is in the PATH
cd "INNO Setup"
call ISCC create_setup.iss 
cd..

cd Site
call vite build
cd..

cd UI
call vite build
cd ..

call firebase deploy

cd output
call dgupdater commit
call dgupdater publish