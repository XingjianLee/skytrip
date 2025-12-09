from sqlalchemy import Column, DECIMAL, Enum, Integer, String, Text

from app.database import Base


class Hotel(Base):
    __tablename__ = "hotels"

    hotel_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    city = Column(String(50), nullable=False)
    address = Column(String(255))
    star_rating = Column(Integer, default=3)
    description = Column(Text)
    phone = Column(String(30))
    status = Column(Enum("active", "inactive", name="hotel_status"), default="active")
    lowest_price = Column(DECIMAL(10, 2), default=0)


