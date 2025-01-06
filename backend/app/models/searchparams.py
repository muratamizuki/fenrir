# 大事
# /hotpepper-restaurantsのリクエストボディ型オプション増やすならここに追加
from pydantic import BaseModel, validator
from typing import Optional

class SearchParams(BaseModel):
    lat: float
    lng: float
    range: int
    keyword: str = ""
    page: Optional[int] = None
    limit: Optional[int] = None
    option1: Optional[int] = None
    suboption1: Optional[int] = None

    @validator("lat", "lng", pre=True)
    def convert_to_float(cls, value):
        try:
            return float(value)
        except ValueError:
            raise ValueError(f"Invalid number: {value}")