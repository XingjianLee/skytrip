from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Agency(Base):
    __tablename__ = "agencies"

    agency_id = Column(Integer, primary_key=True, index=True)
    agency_name = Column(String(100), nullable=False)
    business_license = Column(String(50), nullable=False)
    contact_phone = Column(String(20))
    address = Column(String(255))

    # 可选：如果需要反向关系
    # users = relationship("User", back_populates="agency")

