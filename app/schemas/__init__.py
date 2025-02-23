from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: str

    class Config:
        from_attributes = True

class UserUpdate(UserBase):
    password: str | None = None
