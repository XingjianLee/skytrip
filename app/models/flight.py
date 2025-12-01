from sqlalchemy import Column, Enum, ForeignKey, Integer, String, Time
from sqlalchemy.orm import relationship

from app.database import Base


class Flight(Base):
    __tablename__ = "flights"

    flight_id = Column(Integer, primary_key=True, index=True)
    flight_number = Column(String(10), nullable=False, unique=True)
    airline_code = Column(String(2), nullable=False)
    # 使用字符串引用避免 SQLAlchemy 在启动时找不到 routes 表
    route_id = Column(Integer, ForeignKey("routes.route_id", ondelete="RESTRICT", onupdate="RESTRICT"), nullable=False)
    aircraft_type = Column(String(20))
    economy_seats = Column(Integer, default=120)
    business_seats = Column(Integer, default=30)
    first_seats = Column(Integer, default=10)
    operating_days = Column(String(21), nullable=False)
    status = Column(Enum("active", "suspended", name="flight_status"), default="active")
    scheduled_departure_time = Column(Time, nullable=False)
    scheduled_arrival_time = Column(Time, nullable=False)

    order_items = relationship("OrderItem", back_populates="flight")


