from uuid import uuid4
from sqlalchemy import Column, String, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.base import TimestampMixin

class Contact(Base, TimestampMixin):
    __tablename__ = "contacts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    requestor_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    contact_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    relationship = Column(String)
    status = Column(Enum('pending', 'approved', 'rejected', name='contact_status'))
    
    requestor = relationship("User", foreign_keys=[requestor_id], back_populates="outgoing_contacts")
    contact = relationship("User", foreign_keys=[contact_id], back_populates="incoming_contacts")
