cd Engine
uv sync
call .venv/Scripts/activate
cd..

auto-py-to-exe -c apte-ss-config.json

cd Site
vite build
cd..

cd UI
vite build
cd ..

firebase deploy

cd output
dgupdater commit
dgupdater publish