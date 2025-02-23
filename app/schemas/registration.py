from datetime import datetime
from typing import List, Optional, Literal
from pydantic import BaseModel, EmailStr

class RegistrationStart(BaseModel):
    userType: Literal['family', 'legal', 'educator']
    email: EmailStr

class RegistrationResponse(BaseModel):
    registrationId: str
    verificationToken: str
    expiresAt: str

class EmailVerification(BaseModel):
    registrationId: str
    verificationToken: str

class PersonalInfo(BaseModel):
    registrationId: str
    firstName: str
    lastName: str
    dateOfBirth: datetime
    phone: str
    address: Optional[dict] = None

class IdentityVerification(BaseModel):
    registrationId: str
    verificationType: str
    documentNumber: str
    expirationDate: Optional[datetime] = None

class RelationshipInfo(BaseModel):
    registrationId: str
    relationships: List[dict]
