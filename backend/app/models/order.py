from sqlalchemy import Column, Integer, BigInteger, String, DECIMAL, Enum, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.models.base import Base, TimestampMixin
import enum


class PaymentMethod(enum.Enum):
    """支付方式枚举"""
    ALIPAY = "alipay"
    WECHAT = "wechat"
    UNIONPAY = "unionpay"
    CREDIT_CARD = "credit_card"
    OFFLINE = "offline"


class PaymentStatus(enum.Enum):
    """支付状态枚举"""
    UNPAID = "unpaid"
    PAID = "paid"
    REFUNDED = "refunded"
    FAILED = "failed"


class OrderStatus(enum.Enum):
    """订单状态枚举"""
    PENDING = "pending"
    PAID = "paid"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class Order(Base, TimestampMixin):
    """订单模型"""
    __tablename__ = "orders"

    order_id = Column(BigInteger, primary_key=True, autoincrement=True, comment="订单唯一ID")
    order_no = Column(String(32), unique=True, nullable=False, comment="订单号")
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, comment="下单用户ID")
    total_amount_original = Column(DECIMAL(10, 2), nullable=False, comment="订单原价（折扣前）")
    total_amount = Column(DECIMAL(10, 2), nullable=False, comment="实际支付金额（折扣后）")
    currency = Column(String(3), default="CNY", comment="货币类型")
    
    # 支付相关
    payment_method = Column(
        Enum(PaymentMethod, values_callable=lambda x: [e.value for e in x], validate_strings=True),
        default=PaymentMethod.ALIPAY.value,
        comment="支付方式"
    )
    payment_status = Column(
        Enum(PaymentStatus, values_callable=lambda x: [e.value for e in x], validate_strings=True),
        default=PaymentStatus.UNPAID.value,
        comment="支付状态"
    )
    paid_at = Column(DateTime, nullable=True, comment="实际支付时间")
    
    # 订单状态
    status = Column(
        Enum(OrderStatus, values_callable=lambda x: [e.value for e in x], validate_strings=True),
        default=OrderStatus.PENDING.value,
        comment="订单状态"
    )
    expired_at = Column(DateTime, nullable=True, comment="订单过期时间")

    # 关系
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    # 索引
    __table_args__ = (
        Index('idx_user', 'user_id'),
        Index('idx_order_no', 'order_no'),
        Index('idx_status', 'status'),
    )

    def __repr__(self):
        return f"<Order(id={self.order_id}, no={self.order_no}, status={self.status.value})>"


class CheckInStatus(enum.Enum):
    """值机状态枚举"""
    NOT_CHECKED = "not_checked"
    CHECKED = "checked"


class TicketStatus(enum.Enum):
    """机票状态枚举"""
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"


class OrderItem(Base):
    """订单明细模型"""
    __tablename__ = "order_items"

    item_id = Column(BigInteger, primary_key=True, autoincrement=True, comment="明细唯一ID")
    order_id = Column(BigInteger, ForeignKey("orders.order_id", ondelete="CASCADE"), nullable=False, comment="所属订单")
    
    flight_id = Column(Integer, ForeignKey("flights.flight_id"), nullable=False, comment="航班ID")
    cabin_class = Column(Enum("economy", "business", "first", name="cabin_class"), nullable=False, comment="舱位")
    passenger_id = Column(BigInteger, ForeignKey("passengers.passenger_id"), nullable=False, comment="乘机人ID")
    
    original_price = Column(DECIMAL(10, 2), nullable=False, comment="机票原价（折扣前）")
    paid_price = Column(DECIMAL(10, 2), nullable=False, comment="机票实际支付价格（折扣后）")
    
    seat_number = Column(String(10), nullable=True, comment="座位号（值机后分配）")
    contact_email = Column(String(100), nullable=True, comment="联系邮箱（统一与订单一致）")
    
    # 状态
    check_in_status = Column(
        Enum(CheckInStatus, values_callable=lambda x: [e.value for e in x], validate_strings=True),
        default=CheckInStatus.NOT_CHECKED.value,
        comment="值机状态"
    )
    ticket_status = Column(
        Enum(TicketStatus, values_callable=lambda x: [e.value for e in x], validate_strings=True),
        default=TicketStatus.CONFIRMED.value,
        comment="机票状态"
    )

    # 关系
    order = relationship("Order", back_populates="items")
    flight = relationship("Flight", back_populates="order_items")
    passenger = relationship("Passenger", back_populates="order_items")
    check_in = relationship("CheckIn", back_populates="order_item", uselist=False)

    # 索引
    __table_args__ = (
        Index('idx_order', 'order_id'),
        Index('idx_passenger', 'passenger_id'),
        Index('idx_flight', 'flight_id'),
    )

    def __repr__(self):
        return f"<OrderItem(id={self.item_id}, order_id={self.order_id}, flight_id={self.flight_id})>"