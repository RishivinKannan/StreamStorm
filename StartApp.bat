cd Engine
uv sync
call .venv/Scripts/activate
hypercorn main:app --bind localhost:5000