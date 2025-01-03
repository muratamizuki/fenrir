from fastapi import FastAPI
from app.routes.demo import router as demo_router
from app.routes.gourmatsearch import router as gourmatsearch_router

def create_app():
    app = FastAPI()

    # ルートを登録
    app.include_router(demo_router, prefix="/demo", tags=["Demo"])
    app.include_router(gourmatsearch_router, prefix="/search", tags=["GourmatSearch"])

    return app
