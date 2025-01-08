import requests
from fastapi import HTTPException
from settings import settings
# geolocationを使って緯度経度を取得（search-restaurantsでしか使わない予定）
# フロントで済むことがが判明したのでこの関数は使わないが一応残しておく邪魔だったら消す、バックでやることが無さ過ぎて悲しいよ
def get_geolocation():
    api_url = f"https://www.googleapis.com/geolocation/v1/geolocate?key={settings.GeolocationAPI}"
    payload = {"considerIp": True}

    try:
        response = requests.post(api_url, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Geolocation API failed: {str(e)}")