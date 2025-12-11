from sqlalchemy import Column, BigInteger, String, Enum, Date, Index
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.check_in import CheckIn
import enum


class Gender(enum.Enum):
    """性别枚举"""
    MALE = "M"
    FEMALE = "F"
    NOT_SPECIFIED = "N"


class Passenger(Base):
    """乘客模型"""
    __tablename__ = "passengers"

    passenger_id = Column(BigInteger, primary_key=True, autoincrement=True, comment="乘客唯一ID")
    name = Column(String(50), nullable=False, comment="乘客姓名")
    id_card = Column(String(18), nullable=False, comment="身份证号")
    gender = Column(
        Enum(Gender, values_callable=lambda x: [e.value for e in x], validate_strings=True),
        comment="性别"
    )
    birthday = Column(Date, comment="出生日期")
    nationality = Column(String(50), default="中国", comment="国籍")
    contact_phone = Column(String(20), comment="联系电话")

    # 关系
    order_items = relationship("OrderItem", back_populates="passenger")
    check_ins = relationship("CheckIn", back_populates="passenger")

    # 索引和约束
    __table_args__ = (
        Index('uk_passenger', 'id_card', 'name', unique=True),
    )

    def __repr__(self):
        return f"<Passenger(id={self.passenger_id}, name={self.name}, id_card={self.id_card})>"