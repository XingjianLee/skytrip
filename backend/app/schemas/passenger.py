from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional
from datetime import date
from enum import Enum


class Gender(str, Enum):
    """性别枚举"""
    MALE = "M"
    FEMALE = "F"
    NOT_SPECIFIED = "N"


class PassengerBase(BaseModel):
    """乘客基础模型"""
    name: str = Field(..., max_length=50, description="乘客姓名")
    id_card: str = Field(..., pattern=r"^\d{17}[\dXx]$", description="身份证号")
    gender: Optional[Gender] = Field(None, description="性别")
    birthday: Optional[date] = Field(None, description="出生日期")
    nationality: str = Field("中国", max_length=50, description="国籍")
    contact_phone: Optional[str] = Field(None, pattern=r"^1[3-9]\d{9}$", description="联系电话")

    @field_validator('id_card')
    @classmethod
    def validate_id_card(cls, v):
        """验证身份证号格式"""
        if not v:
            raise ValueError('身份证号不能为空')
        
        # 基本格式验证
        if len(v) != 18:
            raise ValueError('身份证号必须为18位')
        
        # 前17位必须是数字
        if not v[:17].isdigit():
            raise ValueError('身份证号前17位必须是数字')
        
        # 最后一位可以是数字或X
        if not (v[17].isdigit() or v[17].upper() == 'X'):
            raise ValueError('身份证号最后一位必须是数字或X')
        
        return v.upper()

    @field_validator('birthday')
    @classmethod
    def validate_birthday(cls, v):
        """验证出生日期"""
        if v and v > date.today():
            raise ValueError('出生日期不能晚于今天')
        return v


class PassengerCreate(PassengerBase):
    """创建乘客模型"""
    pass


class PassengerUpdate(BaseModel):
    """更新乘客模型"""
    name: Optional[str] = Field(None, max_length=50)
    gender: Optional[Gender] = None
    birthday: Optional[date] = None
    nationality: Optional[str] = Field(None, max_length=50)
    contact_phone: Optional[str] = Field(None, pattern=r"^1[3-9]\d{9}$")


class PassengerInDBBase(PassengerBase):
    """数据库乘客基础模型"""
    passenger_id: int
    model_config = ConfigDict(from_attributes=True)


class Passenger(PassengerInDBBase):
    """乘客响应模型"""
    pass


class PassengerWithOrders(PassengerInDBBase):
    """包含订单信息的乘客模型"""
    # 这里暂时不导入OrderItem，避免循环导入
    # order_items: List["OrderItem"] = []
    pass


class PassengerBookingInfo(BaseModel):
    """乘客预订信息模型（用于订单创建）"""
    name: str = Field(..., max_length=50, description="乘客姓名")
    id_card: str = Field(..., pattern=r"^\d{17}[\dXx]$", description="身份证号")
    gender: Optional[Gender] = Field(None, description="性别")
    birthday: Optional[date] = Field(None, description="出生日期")
    nationality: str = Field("中国", max_length=50, description="国籍")
    contact_phone: Optional[str] = Field(None, pattern=r"^1[3-9]\d{9}$", description="联系电话")
    # 预订相关信息（舱位由 OrderItem 传递，不在乘客信息中重复要求）
    seat_preference: Optional[str] = Field(None, description="座位偏好（如：靠窗、靠过道）")

    @field_validator('id_card')
    @classmethod
    def validate_id_card(cls, v):
        """验证身份证号格式"""
        if not v:
            raise ValueError('身份证号不能为空')
        return v.upper()