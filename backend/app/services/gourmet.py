import requests

"""
店舗検索用

:param lat: 緯度
:param lng: 経度
:param この先すごく長くなるからAPI完成したときに別のドキュメントに書く
:param keyword: 検索キーワード （余力があったら入れる、優先度低）
:return: 店舗情報のリスト
"""


def search_restaurants(lat, lng, renge):
    api_url = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/"
    params = {
        "key": "YOUR_RECRUIT_API_KEY",
        "lat": lat,
        "lng": lng,
        # "keyword": keyword,
        "range": renge,  # 検索範囲 (1=300m, 2=500m, 3=1km, 4=2km, 5=3km)
        
        "format": "json",
    }

    try:
        response = requests.get(api_url, params=params)
        response.raise_for_status()  # ステータスコードがエラーの場合例外を投げる
        return response.json().get("results", {}).get("shop", [])
    except requests.RequestException as e:
        raise RuntimeError(f"Gourmet Search API failed: {e}")
