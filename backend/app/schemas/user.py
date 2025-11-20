from pydantic import BaseModel, EmailStr, field_validator, Field, ConfigDict
from typing import Optional
from datetime import datetime, date
from enum import Enum


class VipLevel(int, Enum):
    """VIP等级枚举"""
    NORMAL = 0
    SILVER = 1
    GOLD = 2
    PLATINUM = 3
    DIAMOND = 4


class UserRole(str, Enum):
    """用户角色枚举"""
    INDIVIDUAL = "individual"
    AGENCY = "agency"
    ADMIN = "admin"


class UserBase(BaseModel):
    """用户基础模型"""
    username: str = Field(..., min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, pattern=r"^1[3-9]\d{9}$")
    real_name: str = Field(..., max_length=50)
    id_card: str = Field(..., pattern=r"^\d{17}[\dXx]$")


class UserCreate(UserBase):
    """创建用户模型"""
    password: str = Field(..., min_length=6, max_length=50)
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('密码长度不能少于6位')
        return v


class UserUpdate(BaseModel):
    """更新用户模型"""
    real_name: Optional[str] = Field(None, max_length=50)
    id_card: Optional[str] = Field(None, pattern=r"^\d{17}[\dXx]$")
    phone: Optional[str] = Field(None, pattern=r"^1[3-9]\d{9}$")
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = Field(None, max_length=255)
    bio: Optional[str] = Field(None, max_length=200)
    vip_expire_date: Optional[date] = None
    agency_id: Optional[int] = None
    vip_level: Optional[VipLevel] = None
    is_active: Optional[bool] = None


class UserInDBBase(UserBase):
    """数据库用户基础模型"""
    id: int
    vip_level: int
    vip_expire_date: Optional[date]
    role: UserRole
    agency_id: Optional[int]
    avatar_url: Optional[str]
    bio: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class User(UserInDBBase):
    """用户响应模型"""
    pass


class UserInDB(UserInDBBase):
    """数据库中的用户模型"""
    password: str


class UserLogin(BaseModel):
    """用户登录模型"""
    username: str
    password: str


class Token(BaseModel):
    """令牌模型"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """令牌数据模型"""
    username: Optional[str] = None