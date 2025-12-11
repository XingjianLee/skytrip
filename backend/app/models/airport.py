from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.models.base import Base


class Airport(Base):
    __tablename__ = "airports"

    airport_code = Column(String(3), primary_key=True)
    airport_name = Column(String(100), nullable=False)
    city = Column(String(50), nullable=False)
    country = Column(String(50), default="中国")

    # Optional reverse relationships
    departure_routes = relationship("Route", foreign_keys="Route.departure_airport_code", back_populates="departure_airport")
    arrival_routes = relationship("Route", foreign_keys="Route.arrival_airport_code", back_populates="arrival_airport")