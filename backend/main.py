import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers.run_model import router as model_router

app = FastAPI()
app_name = "ML Visualization Backend"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(model_router, prefix="/models")

@app.get("/")
async def root():
    return {"message": f"Welcome to {app_name}!"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)