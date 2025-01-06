"""
店舗検索用

:param lat: 緯度
:param lng: 経度
:param この先すごく長くなるからAPI完成したときに別のドキュメントに書く
:param keyword: 検索キーワード （余力があったら入れる、優先度低）
:return: 店舗情報のリスト
"""


import requests
from fastapi import HTTPException
from settings import settings
from app.models.searchparams import SearchParams  # 後述のモデル定義例を参照

def search_restaurants(params: SearchParams):
    api_url = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/"

    # クエリパラメータ
    query_params = {
        "key": settings.hotpepperAPI,
        "lat": params.lat,
        "lng": params.lng,
        "range": params.range,
        "keyword": params.keyword,
        "format": "json",
    }


    if params.page and params.limit:
        query_params["start"] = (params.page - 1) * params.limit + 1
        query_params["count"] = params.limit
    else:
        query_params["count"] = 10

    try:
        response = requests.get(api_url, params=query_params)
        response.raise_for_status()

        data = response.json()
        return data.get("results", {}).get("shop", [])
    except requests.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gourmet API failed: {str(e)}"
        )