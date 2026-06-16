from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import likes
from database import engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ishan Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(likes.router)

@app.get("/")
def root():
    return {"message": "Ishan Portfolio API is running"}
