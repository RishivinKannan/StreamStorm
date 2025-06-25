cd Engine
uv sync
call .venv/Scripts/activate
cd..
auto-py-to-exe -c auto-py-to-exe-config.json
cd output
dgupdater commit
dgupdater publish