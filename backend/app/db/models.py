from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey, CHAR, DECIMAL, Enum, Date, Time, BigInteger, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

# 航空公司表
class Airline(Base):
    __tablename__ = "airlines"
    
    airline_code = Column(CHAR(2), primary_key=True, comment="IATA 航空公司二字代码")
    airline_name = Column(String(100), nullable=False, comment="航空公司全称")
    country = Column(String(50), default="中国", comment="所属国家")

# 机场表
class Airport(Base):
    __tablename__ = "airports"
    
    airport_code = Column(CHAR(3), primary_key=True, comment="IATA 机场三字码")
    airport_name = Column(String(100), nullable=False, comment="机场中文全称")
    city = Column(String(50), nullable=False, comment="所属城市（中文）")
    country = Column(String(50), default="中国", comment="国家")

# 航线表
class Route(Base):
    __tablename__ = "routes"
    
    route_id = Column(Integer, primary_key=True, autoincrement=True, comment="航线唯一ID")
    departure_airport_code = Column(CHAR(3), nullable=False, comment="出发机场三字码")
    arrival_airport_code = Column(CHAR(3), nullable=False, comment="到达机场三字码")
    distance_km = Column(Integer, comment="航程距离（公里）")
    
    # 外键关系
    departure_airport = relationship("Airport", foreign_keys=[departure_airport_code], backref="departure_routes")
    arrival_airport = relationship("Airport", foreign_keys=[arrival_airport_code], backref="arrival_routes")
    
    # 约束和索引
    __table_args__ = (
        UniqueConstraint('departure_airport_code', 'arrival_airport_code', name='uk_route'),
        Index('idx_departure', 'departure_airport_code'),
        Index('idx_arrival', 'arrival_airport_code'),
    )

# 航班表
class Flight(Base):
    __tablename__ = "flights"
    
    flight_id = Column(Integer, primary_key=True, autoincrement=True, comment="航班唯一ID")
    flight_number = Column(String(10), nullable=False, comment="航班号")
    airline_code = Column(CHAR(2), nullable=False, comment="所属航空公司代码")
    route_id = Column(Integer, nullable=False, comment="航线ID")
    
    scheduled_departure_time = Column(Time, nullable=False, comment="计划起飞时间")
    scheduled_arrival_time = Column(Time, nullable=False, comment="计划到达时间")
    aircraft_type = Column(String(20), comment="机型代码")
    
    # 舱位信息
    economy_seats = Column(Integer, nullable=False, default=120)
    business_seats = Column(Integer, nullable=False, default=30)
    first_seats = Column(Integer, nullable=False, default=10)
    
    operating_days = Column(String(7), default='1111111', comment="运营日")
    status = Column(Enum('active', 'suspended', name='flight_status'), default='active')
    
    # 外键关系
    airline = relationship("Airline", backref="flights")
    route = relationship("Route", backref="flights")
    
    # 索引
    __table_args__ = (
        Index('idx_route', 'route_id'),
    )

# 航班定价表
class FlightPricing(Base):
    __tablename__ = "flight_pricing"
    
    pricing_id = Column(Integer, primary_key=True, autoincrement=True)
    flight_id = Column(Integer, nullable=False, comment="关联航班")
    cabin_class = Column(Enum('economy', 'business', 'first', name='cabin_class'), nullable=False, comment="舱位类型")
    base_price = Column(DECIMAL(10, 2), nullable=False, default=0.00, comment="基础定价")
    
    # 外键关系
    flight = relationship("Flight", backref="pricing")
    
    # 约束
    __table_args__ = (
        UniqueConstraint('flight_id', 'cabin_class', name='uk_flight_cabin'),
    )

# 旅行社表
class Agency(Base):
    __tablename__ = "agencies"
    
    agency_id = Column(BigInteger, primary_key=True, autoincrement=True)
    agency_name = Column(String(100), nullable=False, comment="旅行社全称")
    business_license = Column(String(50), unique=True, nullable=False, comment="营业执照注册号")
    contact_phone = Column(String(20))
    address = Column(String(255))

# 用户表
class User(Base):
    __tablename__ = "users"
    
    user_id = Column(BigInteger, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, comment="账户昵称")
    
    # 联系方式
    phone = Column(String(20), comment="手机号")
    email = Column(String(100), comment="邮箱")
    password = Column(String(100), nullable=False, comment="密码")
    
    # 基础身份信息
    real_name = Column(String(50), nullable=False, comment="真实姓名")
    id_card = Column(CHAR(18), nullable=False, comment="身份证号")
    
    # 个人资料
    avatar_url = Column(String(255), comment="头像图片URL")
    bio = Column(String(200), comment="个人签名/简介")
    
    # 会员体系
    vip_level = Column(Integer, default=0, comment="VIP等级：0-普通用户，1-银卡，2-金卡，3-白金等")
    vip_expire_date = Column(Date, comment="VIP有效期")
    
    # 角色与组织归属
    role = Column(Enum('individual', 'agency', 'admin', name='user_role'), nullable=False, default='individual')
    agency_id = Column(BigInteger, comment="所属旅行社ID")
    
    # 外键关系
    agency = relationship("Agency", backref="users")
    
    # 约束
    __table_args__ = (
        UniqueConstraint('id_card', name='uk_idcard'),
        UniqueConstraint('email', name='uk_email'),
        UniqueConstraint('phone', name='uk_phone'),
    )

# 乘客表
class Passenger(Base):
    __tablename__ = "passengers"
    
    passenger_id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    id_card = Column(CHAR(18), nullable=False)
    gender = Column(Enum('M', 'F', 'N', name='gender'), comment="性别")
    birthday = Column(Date, comment="出生日期")
    nationality = Column(String(50), default="中国")
    contact_phone = Column(String(20), comment="乘机人联系电话")
    
    # 约束
    __table_args__ = (
        UniqueConstraint('id_card', 'name', name='uk_passenger'),
    )

# 订单表
class Order(Base):
    __tablename__ = "orders"
    
    order_id = Column(BigInteger, primary_key=True, autoincrement=True)
    order_no = Column(String(32), unique=True, nullable=False, comment="订单号")
    
    user_id = Column(BigInteger, nullable=False, comment="下单用户ID")
    total_amount_original = Column(DECIMAL(10, 2), nullable=False, comment="订单原价（折扣前）")
    total_amount = Column(DECIMAL(10, 2), nullable=False, comment="实际支付金额（折扣后）")
    currency = Column(CHAR(3), default='CNY')
    
    # 支付相关字段
    payment_method = Column(Enum('alipay', 'wechat', 'unionpay', 'credit_card', 'offline', name='payment_method'), default='alipay', comment="支付方式")
    payment_status = Column(Enum('unpaid', 'paid', 'refunded', 'failed', name='payment_status'), default='unpaid')
    paid_at = Column(DateTime, comment="实际支付时间")
    
    # 订单状态
    status = Column(Enum('pending', 'paid', 'cancelled', 'completed', name='order_status'), default='pending')
    
    # 时间控制
    created_at = Column(DateTime, default=func.now())
    expired_at = Column(DateTime, comment="订单过期时间")
    
    # 外键关系
    user = relationship("User", backref="orders")

# 订单明细表
class OrderItem(Base):
    __tablename__ = "order_items"
    
    item_id = Column(BigInteger, primary_key=True, autoincrement=True)
    order_id = Column(BigInteger, nullable=False, comment="所属订单")
    
    flight_id = Column(Integer, nullable=False, comment="航班ID")
    cabin_class = Column(Enum('economy', 'business', 'first', name='cabin_class'), nullable=False, comment="舱位")
    passenger_id = Column(BigInteger, nullable=False, comment="乘机人ID")
    
    original_price = Column(DECIMAL(10, 2), nullable=False, comment="该机票原价（折扣前）")
    paid_price = Column(DECIMAL(10, 2), nullable=False, comment="该机票实际支付价格（折扣后）")
    
    seat_number = Column(String(10), comment="座位号（值机后分配）")
    
    # 状态
    check_in_status = Column(Enum('not_checked', 'checked', name='check_in_status'), default='not_checked')
    ticket_status = Column(Enum('confirmed', 'cancelled', name='ticket_status'), default='confirmed')
    
    # 外键关系
    order = relationship("Order", backref="items")
    flight = relationship("Flight", backref="order_items")
    passenger = relationship("Passenger", backref="order_items")
    
    # 索引
    __table_args__ = (
        Index('idx_order', 'order_id'),
        Index('idx_passenger', 'passenger_id'),
    )

# 值机表
class CheckIn(Base):
    __tablename__ = "check_ins"
    
    check_in_id = Column(BigInteger, primary_key=True, autoincrement=True)
    item_id = Column(BigInteger, nullable=False, comment="关联 order_items.item_id")
    passenger_id = Column(BigInteger, nullable=False)
    flight_id = Column(Integer, nullable=False)
    
    # 值机核心信息
    seat_number = Column(String(10), nullable=False, comment="分配的座位号")
    terminal = Column(String(10), comment="航站楼")
    gate = Column(String(10), comment="登机口")
    boarding_time = Column(DateTime, comment="登机开始时间")
    checked_at = Column(DateTime, default=func.now(), comment="值机完成时间")
    
    # 外键关系
    order_item = relationship("OrderItem", backref="check_in")
    passenger = relationship("Passenger", backref="check_ins")
    flight = relationship("Flight", backref="check_ins")
    
    # 约束和索引
    __table_args__ = (
        UniqueConstraint('item_id', name='uk_item'),
        Index('idx_passenger', 'passenger_id'),
    )
