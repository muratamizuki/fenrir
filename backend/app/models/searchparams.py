from pydantic import BaseModel


# 大事
# /hotpepper-restaurantsのリクエストボディ型オプション増やすならここに追加
class SearchParams(BaseModel):
    lat: float
    lng: float
    range: int
    keyword: str = ""
