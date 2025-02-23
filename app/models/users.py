from uuid import uuid4
from sqlalchemy import Column, String, Enum, ForeignKey, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declared_attr
from app.models.base import Base, TimestampMixin

class User(Base, TimestampMixin):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    role = Column(Enum('resident', 'visitor', 'attorney', 'staff', 'family', 'legal', 'educator', name='user_role'))
    status = Column(Enum('pending', 'approved', 'rejected', name='user_status'))
    facility_id = Column(UUID(as_uuid=True), ForeignKey('facilities.id'))
    # Timestamps inherited from TimestampMixin
    is_active = Column(Boolean, default=True)
    
    @declared_attr
    def facility(cls):
        return relationship("Facility", back_populates="users")

    @declared_attr
    def outgoing_contacts(cls):
        return relationship("Contact", primaryjoin="User.id==foreign(Contact.requestor_id)")

    @declared_attr
    def incoming_contacts(cls):
        return relationship("Contact", primaryjoin="User.id==foreign(Contact.contact_id)")
