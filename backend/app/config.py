from pydantic import HttpUrl
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    secret_key: str = "test_secret_key"  # For testing only
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Database
    database_url: str = "sqlite:///./test.db"
    
    # Twilio
    twilio_account_sid: str = "test_account_sid"
    twilio_api_key_sid: str = "test_api_key_sid"
    twilio_api_key_secret: str = "test_api_key_secret"

    # LiveKit
    video_provider: str = "livekit"
    livekit_url: HttpUrl
    livekit_api_key: str
    livekit_api_secret: str


settings = Settings()
