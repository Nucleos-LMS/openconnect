from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, EmailStr

class RegistrationStart(BaseModel):
    email: EmailStr
    user_type: str

class RegistrationVerifyEmail(BaseModel):
    email: EmailStr
    token: str

class RegistrationPersonalInfo(BaseModel):
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None

class RegistrationVerifyIdentity(BaseModel):
    id_type: str
    id_number: str
    id_expiry: str
    id_image: str

class RegistrationRelationships(BaseModel):
    contacts: List[UUID]
    relationships: List[str]
