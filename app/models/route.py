"""
Route 模型 - 航线信息
虽然 routes 表在数据库中，但为了 SQLAlchemy 能正确识别外键关系，我们创建一个简单的模型
"""
from sqlalchemy import Column, Integer, String

from app.database import Base


class Route(Base):
    __tablename__ = "routes"

    route_id = Column(Integer, primary_key=True, index=True)
    departure_airport_code = Column(String(3), nullable=False)
    arrival_airport_code = Column(String(3), nullable=False)
    distance_km = Column(Integer)

