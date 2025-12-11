from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.models.base import Base


class Airline(Base):
    __tablename__ = "airlines"

    airline_code = Column(String(2), primary_key=True)
    airline_name = Column(String(100), nullable=False)
    country = Column(String(50), default="中国")

    flights = relationship("Flight", back_populates="airline")