# 大事
from fastapi import APIRouter, Depends
from typing import List
from app.models.searchparams import SearchParams
from app.services.gourmet import search_restaurants

router = APIRouter()

@router.get("/hotpepper-restaurants")
def get_restaurants(params: SearchParams = Depends()):
    """クエリパラメータを SearchParams にマッピングし、検索サービスを呼び出す"""
    result = search_restaurants(params)
    return {"restaurants": result}