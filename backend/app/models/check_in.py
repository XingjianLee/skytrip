from sqlalchemy import Column, BigInteger, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class CheckIn(Base):
    __tablename__ = "check_ins"

    check_in_id = Column(BigInteger, primary_key=True, autoincrement=True, comment="值机记录唯一ID")
    order_item_id = Column(BigInteger, ForeignKey("order_items.item_id"), unique=True, nullable=False, comment="关联的订单明细项")
    passenger_id = Column(BigInteger, ForeignKey("passengers.passenger_id"), nullable=False, comment="关联的乘客")
    check_in_time = Column(DateTime, nullable=False, comment="值机办理时间")
    seat_number = Column(String(10), comment="分配的座位号")
    boarding_pass_url = Column(String(255), comment="电子登机牌链接")

    # Relationships
    order_item = relationship("OrderItem", back_populates="check_in")
    passenger = relationship("Passenger", back_populates="check_ins")

    def __repr__(self):
        return f"<CheckIn(id={self.check_in_id}, order_item_id={self.order_item_id})>"