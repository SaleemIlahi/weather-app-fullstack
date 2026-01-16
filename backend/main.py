from fastapi import FastAPI
from .api.weather import router
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

frontend_origin = os.getenv("CORS_ORIGIN").split(",")
allowed_methods = os.getenv("CORS_METHODS").split(",")
cors_header = os.getenv("CORS_HEADERS").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origin,
    allow_methods=allowed_methods,
    allow_headers=cors_header,
)

app.include_router(router, prefix="/api/v1", tags=["weather"])
