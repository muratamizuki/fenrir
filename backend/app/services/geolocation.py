import requests
from flask import current_app
# geolocationを使って緯度経度を取得（search-restaurantsでしか使わない予定）

def get_geolocation():

    api_url = f"https://www.googleapis.com/geolocation/v1/geolocate?key={current_app.config['GeolocationAPI']}"
    payload = {"considerIp": True}

    try:
        response = requests.post(api_url, json=payload)
        response.raise_for_status()
        return response.json()
    # デバック用
    except requests.RequestException as e:
        raise RuntimeError(f"Geolocation API failed: {e}")
