from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import food, coach

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(food.router)
app.include_router(coach.router)

@app.get("/")
def read_root():
    return {"status": "FitSense AI Backend Running"}
