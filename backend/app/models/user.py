from sqlalchemy import Boolean, Column, Integer, String, Date, Enum, BigInteger, DateTime
from sqlalchemy import func
from sqlalchemy.orm import relationship
from app.models.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    phone = Column(String(20), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(100), nullable=False)
    real_name = Column(String(50), nullable=False)
    id_card = Column(String(18), unique=True, nullable=False, index=True)
    avatar_url = Column(String(255))
    bio = Column(String(200))
    vip_level = Column(Integer, default=0)
    vip_expire_date = Column(Date)
    role = Column(Enum('individual', 'agency', 'admin'), nullable=False, default='individual')
    agency_id = Column(BigInteger)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    # is_active 和 is_superuser 可以作为属性方法，而不是数据库字段

    orders = relationship("Order", back_populates="user")

    @property
    def is_active(self) -> bool:
        return True  # 您可以根据需要添加逻辑，例如检查用户是否被禁用

    @property
    def is_superuser(self) -> bool:
        return self.role == 'admin'