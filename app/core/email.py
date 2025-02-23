from typing import Optional
from datetime import datetime, timedelta, timezone
from jose import jwt
from app.config import settings

def generate_verification_token(email: str, expires_delta: Optional[timedelta] = None) -> str:
    """Generate email verification token."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(hours=24)
    
    to_encode = {
        "exp": expire,
        "email": email,
        "type": "email_verification"
    }
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

def verify_token(email: str, token: str) -> bool:
    """Verify email verification token."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return (
            payload.get("type") == "email_verification" and
            payload.get("email") == email
        )
    except jwt.JWTError:
        return False
