from sqlalchemy import Column, Integer, String, Time, Date, ForeignKey, Enum, Index
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum


class FlightStatus(enum.Enum):
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"


class Flight(Base):
    """航班模型"""
    __tablename__ = "flights"

    flight_id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("routes.route_id"))
    airline_code = Column(String(10), ForeignKey("airlines.airline_code"))
    flight_number = Column(String(20), unique=True, index=True, nullable=False)
    scheduled_departure_time = Column(Time, nullable=False, comment="计划起飞时刻（不含日期）")
    scheduled_arrival_time = Column(Time, nullable=False, comment="计划到达时刻（不含日期）")
    economy_seats = Column(Integer, nullable=False, default=150)
    business_seats = Column(Integer, nullable=False, default=30)
    first_seats = Column(Integer, nullable=False, default=10)
    # 暂时废除枚举绑定，避免读取数据库旧值（如 'active'）时报错
    status = Column(String(20), nullable=False, default="ACTIVE")
    operating_days = Column(
        String(21), nullable=False, default="000000000000000000000"
    )

    # 关系
    airline = relationship("Airline", back_populates="flights")
    route = relationship("Route", back_populates="flights")
    pricing = relationship("FlightPricing", back_populates="flight")
    order_items = relationship("OrderItem", back_populates="flight")

    # 索引
    __table_args__ = (
        Index('idx_route', 'route_id'),
        Index('idx_airline', 'airline_code'),
        Index('idx_flight_number', 'flight_number'),
    )

    def __repr__(self):
        return f"<Flight(id={self.flight_id}, number={self.flight_number}, route_id={self.route_id})>"