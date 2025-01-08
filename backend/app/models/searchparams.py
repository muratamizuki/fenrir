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
    open_air: Optional[int] = None
    night_view: Optional[int] = None
    sommelier: Optional[int] = None
    show: Optional[int] = None
    equipment: Optional[int] = None
    karaoke: Optional[int] = None
    band: Optional[int] = None
    charter: Optional[int] = None
    wedding: Optional[int] = None
    tv: Optional[int] = None
    sake: Optional[int] = None
    wine: Optional[int] = None
    cocktail: Optional[int] = None
    shochu: Optional[int] = None
    english: Optional[int] = None
    ktai: Optional[int] = None
    free_food: Optional[int] = None
    free_drink: Optional[int] = None
    lunch: Optional[int] = None
    course: Optional[int] = None
    non_smoking: Optional[int] = None
    card: Optional[int] = None
    private_room: Optional[int] = None
    parking: Optional[int] = None
    barrier_free: Optional[int] = None
    midnight: Optional[int] = None
    midnight_meal: Optional[int] = None
    pet: Optional[int] = None
    child: Optional[int] = None
    wifi: Optional[int] = None
    tatami: Optional[int] = None
    horigotatsu: Optional[int] = None


    @validator("lat", "lng", pre=True)
    def convert_to_float(cls, value):
        try:
            return float(value)
        except ValueError:
            raise ValueError(f"Invalid number: {value}")