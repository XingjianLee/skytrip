from datetime import datetime
from decimal import Decimal
from typing import Literal, Optional

from pydantic import BaseModel, condecimal, Field


class OrderUpdate(BaseModel):
    status: Optional[Literal["pending", "paid", "cancelled", "completed"]] = None
    payment_status: Optional[Literal["unpaid", "paid", "refunded", "failed"]] = None
    total_amount: Optional[condecimal(max_digits=10, decimal_places=2)] = None


class OrderSearchParams(BaseModel):
    """订单搜索参数"""
    order_no: Optional[str] = None
    user_id: Optional[int] = None
    username: Optional[str] = None
    status: Optional[Literal["pending", "paid", "cancelled", "completed"]] = None
    payment_status: Optional[Literal["unpaid", "paid", "refunded", "failed"]] = None
    payment_method: Optional[Literal["alipay", "wechat", "unionpay", "credit_card", "offline"]] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    min_amount: Optional[Decimal] = None
    max_amount: Optional[Decimal] = None
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)


class OrderItemResponse(BaseModel):
    """订单明细响应"""
    item_id: int
    flight_id: int
    flight_number: Optional[str] = None
    cabin_class: str
    passenger_id: int
    passenger_name: Optional[str] = None
    original_price: Decimal
    paid_price: Decimal
    seat_number: Optional[str] = None
    check_in_status: str
    ticket_status: str

    class Config:
        from_attributes = True


class OrderDetailResponse(BaseModel):
    """订单详情响应"""
    order_id: int
    order_no: str
    user_id: int
    username: Optional[str] = None
    user_email: Optional[str] = None
    total_amount: Decimal
    total_amount_original: Decimal
    currency: str
    payment_method: Optional[str] = None
    payment_status: str
    status: str
    created_at: datetime
    paid_at: Optional[datetime] = None
    expired_at: Optional[datetime] = None
    updated_at: datetime
    items: list[OrderItemResponse] = []

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    """订单列表响应"""
    order_id: int
    order_no: str
    user_id: int
    username: Optional[str] = None
    total_amount: Decimal
    total_amount_original: Decimal
    status: str
    payment_status: str
    payment_method: Optional[str] = None
    created_at: datetime
    paid_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class OrderRefundRequest(BaseModel):
    """订单退款请求"""
    refund_amount: Optional[condecimal(max_digits=10, decimal_places=2)] = None
    reason: Optional[str] = None
    refund_method: Optional[Literal["original", "manual"]] = Field(
        default="original", description="退款方式：original=原路退回，manual=手动退款"
    )


class OrderChangeRequest(BaseModel):
    """订单改签请求"""
    new_flight_id: Optional[int] = None
    new_date: Optional[datetime] = None
    new_cabin_class: Optional[Literal["economy", "business", "first"]] = None
    reason: Optional[str] = None
    adjust_amount: Optional[Decimal] = None


class OrderListResponse(BaseModel):
    """订单列表响应（带分页）"""
    total: int
    page: int
    page_size: int
    total_pages: int
    items: list[OrderResponse]


