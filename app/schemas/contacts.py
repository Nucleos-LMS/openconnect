from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class ContactBase(BaseModel):
    requestor_id: UUID
    contact_id: UUID
    relationship: str

class ContactCreate(ContactBase):
    pass

class ContactRead(ContactBase):
    id: UUID
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ContactUpdate(BaseModel):
    status: Optional[str] = None
    relationship: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
