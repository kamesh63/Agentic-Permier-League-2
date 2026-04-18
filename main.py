import os
import logging
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to import backend routes
try:
    from backend.routes import food, coach
    backend_available = True
except ImportError as e:
    logger.error(f"Could not import backend routes: {e}")
    backend_available = False

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint for Google Cloud
@app.get("/health")
def health_check():
    return {"status": "healthy", "backend": backend_available}

# Include backend routes under /api
if backend_available:
    app.include_router(food.router, prefix="/api")
    app.include_router(coach.router, prefix="/api")

# Path to the built frontend (relative to this file)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
dist_path = os.path.join(BASE_DIR, "frontend", "dist")

logger.info(f"Looking for frontend in: {dist_path}")

# Serve static files (assets like CSS/JS)
if os.path.exists(dist_path):
    assets_path = os.path.join(dist_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # If the file exists in dist, serve it
        file_path = os.path.join(dist_path, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # Default to index.html for SPA routing
        index_file = os.path.join(dist_path, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        
        return JSONResponse({"error": "Frontend files missing"}, status_code=404)
else:
    logger.warning("Frontend dist directory not found!")
    @app.get("/")
    def root_fallback():
        return {"status": "Backend running, but frontend files (dist) were not found."}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
