from datetime import datetime, timezone
from sqlalchemy.orm import declarative_base, registry
from sqlalchemy import Column, DateTime

# Create a registry to share metadata between models
mapper_registry = registry()
Base = declarative_base(metadata=mapper_registry.metadata)

class TimestampMixin:
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

# Import models here to register them with SQLAlchemy
from app.models.facilities import Facility  # noqa: F401
from app.models.users import User  # noqa: F401
from app.models.contacts import Contact  # noqa: F401
from app.models.video_calls import VideoCall  # noqa: F401
