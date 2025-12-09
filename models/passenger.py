from sqlalchemy import Column, Date, Enum, Integer, String

from app.database import Base


class Passenger(Base):
    __tablename__ = "passengers"

    passenger_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    id_card = Column(String(18), nullable=False, unique=True)
    gender = Column(Enum("M", "F", "N", name="gender"))
    birthday = Column(Date)
    nationality = Column(String(50), default="中国")
    contact_phone = Column(String(20))

