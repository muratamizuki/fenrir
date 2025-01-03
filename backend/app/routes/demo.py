# 確認用
from fastapi import APIRouter
from app.services.geolocation import get_geolocation

router = APIRouter()

@router.get("/")
def demo():
    return {"message": "Hello!"}

@router.get("/geolocation")
def get_location():
    # geolocation角に尿
    location = get_geolocation()
    return location