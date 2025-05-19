from datetime import timedelta, datetime
import os
from typing import Optional

try:
    from livekit import AccessToken, VideoGrant  # type: ignore
except ImportError:  # pragma: no cover
    # livekit package might not be installed in unit-test environment. Provide minimal stub
    class VideoGrant(dict):
        pass

    class AccessToken:  # type: ignore
        def __init__(self, api_key: str, api_secret: str, identity: str):
            self.api_key = api_key
            self.api_secret = api_secret
            self.identity = identity
            self.ttl: timedelta = timedelta(hours=2)
            self.video = None

        def to_jwt(self) -> str:  # pragma: no cover
            return f"mock_livekit_token_{self.identity}"

        @property
        def grants(self):
            return {}


def generate_room_token(room_name: str, user_id: str, *, ttl_hours: int = 2) -> str:
    """Generate a LiveKit JWT for the given room and user.

    If the LIVEKIT_API_KEY or LIVEKIT_API_SECRET environment variables are not
    configured, a deterministic mock token is returned. This allows the rest of
    the application to function in local development or CI where LiveKit isn't
    available.
    """
    api_key: Optional[str] = os.getenv("LIVEKIT_API_KEY")
    api_secret: Optional[str] = os.getenv("LIVEKIT_API_SECRET")

    # Return a mock token if credentials are missing (e.g., running tests)
    if not api_key or not api_secret:
        return f"mock_livekit_token_{room_name}_{user_id}"

    grant = VideoGrant(room_join=True, room=room_name)
    token = AccessToken(api_key, api_secret, identity=user_id)
    token.video = grant
    token.ttl = timedelta(hours=ttl_hours)
    jwt = token.to_jwt()
    return jwt
