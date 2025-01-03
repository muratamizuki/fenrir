# demoって名前はややこしいかも
from fastapi import APIRouter
from app.services.geolocation import get_geolocation

router = APIRouter()

@router.get("/")
def demo():
    """Demo エンドポイント"""
    return {"message": "Hello!"}

@router.get("/geolocation")
