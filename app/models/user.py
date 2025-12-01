from sqlalchemy import Boolean, Column, Date, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    phone = Column(String(20))
    email = Column(String(100))
    password = Column(String(100), nullable=False)
    real_name = Column(String(50), nullable=False)
    id_card = Column(String(18), nullable=False, unique=True)
    avatar_url = Column(String(255))
    bio = Column(String(200))
    vip_level = Column(Integer, default=0)
    vip_expire_date = Column(Date)
    role = Column(Enum("individual", "agency", "admin", name="user_role"), default="individual")
    agency_id = Column(Integer, ForeignKey("agencies.agency_id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    id_issue_date = Column(Date)
    id_expiry_date = Column(Date)
    id_issuer = Column(String(100))
    is_frozen = Column(Boolean, default=False)

    orders = relationship("Order", back_populates="user")

    @property
    def is_admin(self) -> bool:
        return self.role == "admin"


