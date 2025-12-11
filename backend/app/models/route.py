from sqlalchemy import Column, Integer, String, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.models.base import Base


class Route(Base):
    __tablename__ = "routes"

    route_id = Column(Integer, primary_key=True, autoincrement=True)
    departure_airport_code = Column(String(3), ForeignKey("airports.airport_code"), nullable=False)
    arrival_airport_code = Column(String(3), ForeignKey("airports.airport_code"), nullable=False)
    distance_km = Column(Integer)

    departure_airport = relationship("Airport", foreign_keys=[departure_airport_code], back_populates="departure_routes")
    arrival_airport = relationship("Airport", foreign_keys=[arrival_airport_code], back_populates="arrival_routes")
    flights = relationship("Flight", back_populates="route")

    __table_args__ = (
        Index('idx_departure', 'departure_airport_code'),
        Index('idx_arrival', 'arrival_airport_code'),
    )