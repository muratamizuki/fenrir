from fastapi import APIRouter
from app.services.geolocation import get_geolocation
from app.services.gourmet import search_restaurants

router = APIRouter()

@router.get("/gourmetsearch")
def search_restaurants_by_location(range: int = 3):
    # 現在地を元に店を検索
    # 位置情報を取得
    location = get_geolocation()
    lat = location["location"]["lat"]
    lng = location["location"]["lng"]

    # お店を検索
    results = search_restaurants(lat=lat, lng=lng, range=range)
    return {"location": location, "restaurants": results}
