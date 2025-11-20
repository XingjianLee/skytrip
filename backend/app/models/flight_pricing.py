from sqlalchemy import Column, Integer, ForeignKey, Enum, DECIMAL, Index
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum


class CabinClass(enum.Enum):
    """舱位类型枚举"""
    ECONOMY = "economy"
    BUSINESS = "business"
    FIRST = "first"


class FlightPricing(Base):
    """航班定价模型"""
    __tablename__ = "flight_pricing"

    pricing_id = Column(Integer, primary_key=True, autoincrement=True, comment="定价唯一ID")
    flight_id = Column(Integer, ForeignKey("flights.flight_id", ondelete="CASCADE"), nullable=False, comment="关联航班")
    cabin_class = Column(
        Enum(CabinClass, values_callable=lambda x: [e.value for e in x], validate_strings=True),
        nullable=False,
        comment="舱位类型"
    )
    base_price = Column(DECIMAL(10, 2), nullable=False, default=0.00, comment="基础定价")

    # 关系
    flight = relationship("Flight", back_populates="pricing")

    # 索引和约束
    __table_args__ = (
        Index('uk_flight_cabin', 'flight_id', 'cabin_class', unique=True),
    )

    def __repr__(self):
        return f"<FlightPricing(flight_id={self.flight_id}, cabin={self.cabin_class.value}, price={self.base_price})>"