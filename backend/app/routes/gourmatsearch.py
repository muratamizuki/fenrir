# 大事
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from app.models.searchparams import SearchParams
from app.services.gourmet import search_restaurants
from app.services.gourmet import search_restaurants_random
from app.services.gourmet import search_restaurant_detail

router = APIRouter()

# 店店舗検索
@router.get("/hotpepper-restaurants")
def get_restaurants(params: SearchParams = Depends()):
    result = search_restaurants(params)
    return {"restaurants": result}



@router.get("/hotpepper-restaurants/detail")
def get_restaurant_detail(id):
    result = search_restaurant_detail(id)
    return {"restaurants": result}


@router.get("/hotpepper-restaurants/random")
def get_random_restaurant(params: SearchParams = Depends()):
    result = search_restaurants_random(params)
    return {"restaurants": result}