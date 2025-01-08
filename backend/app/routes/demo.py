# 確認用
from fastapi import APIRouter, Depends, HTTPException, Query
from app.models.searchparams import SearchParams
from app.services.gourmet import search_restaurants
from app.services.gourmet import search_restaurant_detail

router = APIRouter()

@router.get("/")
def demo():
    return {"message": "Hello!"}

@router.get("/geolocation")
def get_location():
    # geolocation角に尿
    location = get_geolocation()
    return location

# でも
@router.post("/hotpepper-restaurants")
def get_restaurants(params: SearchParams = Depends()):
    result = search_restaurants(params)
    return {"restaurants": result}

@router.post("/hotpepper-restaurants/detail")
def get_restaurant_detail(id: str = Query(..., description="レストランのIDを指定")):
    try:
        result = search_restaurant_detail(id)
        if not result:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        return {"restaurant": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))