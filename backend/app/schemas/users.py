from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, ConfigDict

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str
    facility_id: Optional[UUID] = None

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: UUID
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    facility_id: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)
