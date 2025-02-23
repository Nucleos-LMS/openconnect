from uuid import uuid4
from sqlalchemy import Column, String, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.base import TimestampMixin

class Facility(Base, TimestampMixin):
    __tablename__ = "facilities"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String, unique=True, index=True)
    settings = Column(JSON)
    
    users = relationship("User", back_populates="facility")
