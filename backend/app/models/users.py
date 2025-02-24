from uuid import uuid4
from sqlalchemy import Column, String, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.base import TimestampMixin

class User(Base, TimestampMixin):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum('resident', 'visitor', 'attorney', 'staff', name='user_role'))
    name = Column(String)
    status = Column(Enum('pending', 'approved', 'rejected', name='user_status'))
    facility_id = Column(UUID(as_uuid=True), ForeignKey('facilities.id'))
    
    facility = relationship("Facility", back_populates="users")
    outgoing_contacts = relationship("Contact", foreign_keys="Contact.requestor_id", back_populates="requestor")
    incoming_contacts = relationship("Contact", foreign_keys="Contact.contact_id", back_populates="contact")
