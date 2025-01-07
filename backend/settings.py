from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    hotpepperAPI: str

    class Config:
        env_file = ".env"

settings = Settings()