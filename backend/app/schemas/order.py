from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum
from .passenger import PassengerBookingInfo, Passenger
from .flight import CabinClass


class PaymentMethod(str, Enum):
    """支付方式枚举"""
    ALIPAY = "alipay"
    WECHAT = "wechat"
    UNIONPAY = "unionpay"
    CREDIT_CARD = "credit_card"
    OFFLINE = "offline"


class PaymentStatus(str, Enum):
    """支付状态枚举"""
    UNPAID = "unpaid"
    PAID = "paid"
    REFUNDED = "refunded"
    FAILED = "failed"


class OrderStatus(str, Enum):
    """订单状态枚举"""
    PENDING = "pending"
    PAID = "paid"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class CheckInStatus(str, Enum):
    """值机状态枚举"""
    NOT_CHECKED = "not_checked"
    CHECKED = "checked"


class TicketStatus(str, Enum):
    """机票状态枚举"""
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"


class OrderItemCreate(BaseModel):
    """创建订单明细模型"""
    flight_id: int = Field(..., description="航班ID")
    cabin_class: CabinClass = Field(..., description="舱位类型")
    passenger_info: PassengerBookingInfo = Field(..., description="乘客信息")


class OrderCreate(BaseModel):
    """创建订单模型"""
    items: List[OrderItemCreate] = Field(..., min_length=1, description="订单明细列表")
    payment_method: PaymentMethod = Field(PaymentMethod.ALIPAY, description="支付方式")
    contact_phone: Optional[str] = Field(None, pattern=r"^1[3-9]\d{9}$", description="联系电话")
    contact_name: Optional[str] = Field(None, max_length=50, description="订单联系人姓名")
    contact_email: Optional[str] = Field(None, description="订单联系人邮箱")

    @field_validator('items')
    @classmethod
    def validate_items(cls, v):
        if not v:
            raise ValueError('订单明细不能为空')
        if len(v) > 9:
            raise ValueError('单次订单最多支持9位乘客')
        return v


class OrderItemInDBBase(BaseModel):
    """数据库订单明细基础模型"""
    item_id: int
    order_id: int
    flight_id: int
    cabin_class: str
    passenger_id: int
    original_price: float
    paid_price: float
    seat_number: Optional[str] = None
    contact_email: Optional[str] = None
    check_in_status: CheckInStatus
    ticket_status: TicketStatus
    model_config = ConfigDict(from_attributes=True)


class OrderItem(OrderItemInDBBase):
    """订单明细响应模型"""
    pass


class OrderItemWithDetails(OrderItemInDBBase):
    """包含详细信息的订单明细模型"""
    passenger: Optional[Passenger] = None
    # flight: Optional["Flight"] = None  # 避免循环导入


class OrderInDBBase(BaseModel):
    """数据库订单基础模型"""
    order_id: int
    order_no: str
    user_id: int
    total_amount_original: float
    total_amount: float
    currency: str
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    paid_at: Optional[datetime] = None
    status: OrderStatus
    expired_at: Optional[datetime] = None
    contact_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class Order(OrderInDBBase):
    """订单响应模型"""
    pass


class OrderWithItems(OrderInDBBase):
    """包含明细的订单模型"""
    items: List[OrderItemWithDetails] = []


class OrderUpdate(BaseModel):
    """更新订单模型"""
    payment_method: Optional[PaymentMethod] = None
    status: Optional[OrderStatus] = None


class OrderPayment(BaseModel):
    """订单支付模型"""
    order_no: str = Field(..., description="订单号")
    payment_method: PaymentMethod = Field(..., description="支付方式")
    payment_amount: Optional[float] = Field(None, description="支付金额（用于验证）")


class OrderQuery(BaseModel):
    """订单查询模型"""
    order_no: Optional[str] = Field(None, description="订单号")
    status: Optional[OrderStatus] = Field(None, description="订单状态")
    payment_status: Optional[PaymentStatus] = Field(None, description="支付状态")
    start_date: Optional[datetime] = Field(None, description="开始日期")
    end_date: Optional[datetime] = Field(None, description="结束日期")
    page: int = Field(1, ge=1, description="页码")
    page_size: int = Field(10, ge=1, le=100, description="每页数量")


class OrderSummary(BaseModel):
    """订单摘要模型"""
    order_no: str
    total_amount: float
    payment_status: PaymentStatus
    status: OrderStatus
    passenger_count: int
    flight_count: int
    created_at: datetime