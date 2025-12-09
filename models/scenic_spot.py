from sqlalchemy import Column, DECIMAL, Enum, Integer, String, Text

from app.database import Base


class ScenicSpot(Base):
    __tablename__ = "scenic_spots"

    spot_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    city = Column(String(50), nullable=False)
    address = Column(String(255))
    description = Column(Text)
    open_time = Column(String(50))
    close_time = Column(String(50))
    ticket_price = Column(DECIMAL(10, 2), default=0)
    status = Column(Enum("active", "inactive", name="spot_status"), default="active")


