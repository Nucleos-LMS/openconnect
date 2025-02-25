from pydantic_settings import BaseSettings

class DatabaseSettings(BaseSettings):
    url: str

    class Config:
        env_prefix = "POSTGRES_"

db_settings = DatabaseSettings()
