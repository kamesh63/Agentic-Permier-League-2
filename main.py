import os
import logging
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Robust import handling
try:
    from backend.routes import food, coach
    app.include_router(food.router, prefix="/api")
    app.include_router(coach.router, prefix="/api")
    logger.info("✅ Backend routes loaded successfully")
except Exception as e:
    logger.error(f"⚠️ Backend routes failed to load: {e}")

# Static file serving
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
dist_path = os.path.join(BASE_DIR, "frontend", "dist")

@app.get("/health")
def health():
    return {"status": "ok"}

if os.path.exists(dist_path):
    # Mount assets if they exist
    assets_path = os.path.join(dist_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    @app.get("/{full_path:path}")
    async def serve_all(full_path: str):
        full_file_path = os.path.join(dist_path, full_path)
        if os.path.isfile(full_file_path):
            return FileResponse(full_file_path)
        return FileResponse(os.path.join(dist_path, "index.html"))
else:
    @app.get("/")
    def fallback():
        return {"error": "Frontend dist not found", "dir": os.listdir(BASE_DIR)}
