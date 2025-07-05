cd Engine
uv sync
call .venv/Scripts/activate
cd..
auto-py-to-exe -c apte-ss-config.json
cd output
dgupdater commit
dgupdater publish