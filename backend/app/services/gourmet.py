"""
店舗検索用

:param lat: 緯度
:param lng: 経度
:param この先すごく長くなるからAPI完成したときに別のドキュメントに書く
:param keyword: 検索キーワード （余力があったら入れる、優先度低）
:return: 店舗情報のリスト
"""


import requests
from fastapi import HTTPException, Query
from settings import settings
from typing import Dict
from app.models.searchparams import SearchParams  # 後述のモデル定義例を参照

def search_restaurants(params: SearchParams):
    api_url = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/"

    # 基本のクエリパラメータ
    query_params: Dict[str, str] = {
        "key": settings.hotpepperAPI,
        "lat": str(params.lat),
        "lng": str(params.lng),
        "range": str(params.range),
        "keyword": params.keyword,
        "format": "json",
    }

    # ページリミット処理
    if params.page and params.limit:
        query_params["start"] = str((params.page - 1) * params.limit + 1)
        query_params["count"] = str(params.limit)
    else:
        query_params["count"] = "10"

    # クエリ追加
    for field_name, field_value in params.dict().items():
        if field_value is not None and field_name not in ["lat", "lng", "range", "keyword", "page", "limit"]:
            query_params[field_name] = str(field_value)

    try:
        # APIリクエスト
        response = requests.get(api_url, params=query_params)
        response.raise_for_status()
        data = response.json()
        return data.get("results", {}).get("shop", [])
    except requests.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gourmet API failed: {str(e)}"
        )



def search_restaurant_detail(id):
    api_url = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/"
    query_params = {
        "key": settings.hotpepperAPI,
        "id": id,
        "format": "json",
    }

    try:
        response = requests.get(api_url, params=query_params)
        response.raise_for_status()
        data = response.json()
        return data.get("results", {}).get("shop", [])
    except requests.RequestException as e:
        print(f"URL: {response.url}")
        print(f"Response Content: {response.text}")
        print(f"Error: {e}")
        return None