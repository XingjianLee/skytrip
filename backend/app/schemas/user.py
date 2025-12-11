from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, date

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: bool = True
    is_superuser: bool = False
    full_name: Optional[str] = None

# Properties to receive via API on creation
class UserCreate(BaseModel):
    username: str
    email: Optional[EmailStr] = None
    password: str = Field(..., min_length=6)
    real_name: str
    id_card: str
    phone: Optional[str] = None

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None
    real_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    id_issue_date: Optional[date] = None
    id_expiry_date: Optional[date] = None
    id_issuer: Optional[str] = None

class UserInDBBase(UserBase):
    id: int
    username: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    real_name: Optional[str] = None
    id_card: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    vip_level: int = 0
    vip_expire_date: Optional[date] = None
    role: Optional[str] = None
    agency_id: Optional[int] = None
    id_issue_date: Optional[date] = None
    id_expiry_date: Optional[date] = None
    id_issuer: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

# Additional properties to return via API
class User(UserInDBBase):
    pass

# Additional properties stored in DB
class UserInDB(UserBase):
    id: int
    hashed_password: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None
