from uuid import uuid4
from sqlalchemy import Column, String, JSON, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.base import TimestampMixin

class Facility(Base, TimestampMixin):
    __tablename__ = "facilities"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String, unique=True)
    settings = Column(JSON, default={
        "network": {
            "max_bandwidth": 1000,
            "allowed_ip_ranges": [],
            "vpn_required": False,
            "latency_threshold": 150
        },
        "devices": {
            "allowed_browsers": ["chrome", "firefox"],
            "min_browser_version": "90",
            "allowed_devices": ["desktop", "mobile"],
            "require_camera": True,
            "require_microphone": True
        },
        "security": {
            "require_vpn": False,
            "allowed_auth_methods": ["password"],
            "session_timeout": 30,
            "max_failed_attempts": 5,
            "password_policy": {}
        },
        "deployment": {
            "deployment_type": "cloud",
            "update_policy": "automatic",
            "backup_policy": {},
            "maintenance_window": {}
        }
    })  # Configurable jail settings
    # Timestamps inherited from TimestampMixin
    
    # Relationships
    users = relationship("User", back_populates="facility")
