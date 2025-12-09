from sqlalchemy import Column, DateTime, DECIMAL, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    order_id = Column(Integer, primary_key=True, index=True)
    order_no = Column(String(32), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    total_amount_original = Column(DECIMAL(10, 2), nullable=False)
    currency = Column(String(3), default="CNY")
    payment_method = Column(
        Enum("alipay", "wechat", "unionpay", "credit_card", "offline", name="payment_method"),
        default="alipay",
    )
    payment_status = Column(
        Enum("unpaid", "paid", "refunded", "failed", name="payment_status"), default="unpaid"
    )
    paid_at = Column(DateTime)
    status = Column(
        Enum("pending", "paid", "cancelled", "completed", name="order_status"), default="pending"
    )
    created_at = Column(DateTime)
    expired_at = Column(DateTime)
    updated_at = Column(DateTime)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")


