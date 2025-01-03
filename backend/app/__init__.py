from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.demo import router as demo_router
from app.routes.gourmatsearch import router as gourmatsearch_router

def create_app():
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ルートを登録
    app.include_router(demo_router, prefix="/demo", tags=["Demo"])
    app.include_router(gourmatsearch_router, prefix="/search", tags=["GourmatSearch"])

    return app
