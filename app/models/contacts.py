from uuid import uuid4
from sqlalchemy import Column, String, Enum, ForeignKey, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declared_attr
from app.models.base import Base, TimestampMixin

class Contact(Base, TimestampMixin):
    __tablename__ = "contacts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    requestor_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    contact_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    status = Column(Enum('pending', 'approved', 'rejected', name='contact_status'))
    relationship = Column(String)
    # Timestamps inherited from TimestampMixin
    
    @declared_attr
    def requestor(cls):
        return relationship("User", primaryjoin="User.id==foreign(Contact.requestor_id)")

    @declared_attr
    def contact(cls):
        return relationship("User", primaryjoin="User.id==foreign(Contact.contact_id)")
