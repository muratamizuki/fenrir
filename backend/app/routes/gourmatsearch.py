from fastapi import APIRouter
from pydantic import BaseModel
from app.services.gourmet import search_restaurants
from app.models.searchparams import SearchParams

# 大事
class SearchParams(BaseModel):
    lat: float
    lng: float
    range: int
    keyword: str

router = APIRouter()


@router.post("/hotpepper-restaurants")
def search_restaurants_by_location(params: SearchParams):
    results = search_restaurants(params)
    return {"restaurants": results}