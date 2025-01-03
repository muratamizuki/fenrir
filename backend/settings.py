from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GeolocationAPI: str
    hotpepperAPI: str

    class Config:
        env_file = ".env"

settings = Settings()