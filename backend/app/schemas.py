from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date, time
from decimal import Decimal

# 航空公司相关模式
class AirlineBase(BaseModel):
    airline_code: str
    airline_name: str
    country: Optional[str] = "中国"

class AirlineCreate(AirlineBase):
    pass

class AirlineUpdate(BaseModel):
    airline_name: Optional[str] = None
    country: Optional[str] = None

class Airline(AirlineBase):
    class Config:
        from_attributes = True

# 机场相关模式
class AirportBase(BaseModel):
    airport_code: str
    airport_name: str
    city: str
    country: Optional[str] = "中国"

class AirportCreate(AirportBase):
    pass

class AirportUpdate(BaseModel):
    airport_name: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None

class Airport(AirportBase):
    class Config:
        from_attributes = True

# 航线相关模式
class RouteBase(BaseModel):
    departure_airport_code: str
    arrival_airport_code: str
    distance_km: Optional[int] = None

class RouteCreate(RouteBase):
    pass

class RouteUpdate(BaseModel):
    distance_km: Optional[int] = None

class Route(RouteBase):
    route_id: int
    
    class Config:
        from_attributes = True

# 航班相关模式
class FlightBase(BaseModel):
    flight_number: str
    airline_code: str
    route_id: int
    scheduled_departure_time: time
    scheduled_arrival_time: time
    aircraft_type: Optional[str] = None
    economy_seats: int = 120
    business_seats: int = 30
    first_seats: int = 10
    operating_days: str = '1111111'
    status: str = 'active'

class FlightCreate(FlightBase):
    pass

class FlightUpdate(BaseModel):
    flight_number: Optional[str] = None
    scheduled_departure_time: Optional[time] = None
    scheduled_arrival_time: Optional[time] = None
    aircraft_type: Optional[str] = None
    economy_seats: Optional[int] = None
    business_seats: Optional[int] = None
    first_seats: Optional[int] = None
    operating_days: Optional[str] = None
    status: Optional[str] = None

class Flight(FlightBase):
    flight_id: int
    
    class Config:
        from_attributes = True

# 航班定价相关模式
class FlightPricingBase(BaseModel):
    flight_id: int
    cabin_class: str
    base_price: Decimal

class FlightPricingCreate(FlightPricingBase):
    pass

class FlightPricingUpdate(BaseModel):
    base_price: Optional[Decimal] = None

class FlightPricing(FlightPricingBase):
    pricing_id: int
    
    class Config:
        from_attributes = True

# 旅行社相关模式
class AgencyBase(BaseModel):
    agency_name: str
    business_license: str
    contact_phone: Optional[str] = None
    address: Optional[str] = None

class AgencyCreate(AgencyBase):
    pass

class AgencyUpdate(BaseModel):
    agency_name: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None

class Agency(AgencyBase):
    agency_id: int
    
    class Config:
        from_attributes = True

# 用户相关模式
class UserBase(BaseModel):
    username: str
    phone: Optional[str] = None
    email: Optional[str] = None
    real_name: str
    id_card: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    vip_level: int = 0
    vip_expire_date: Optional[date] = None
    role: str = 'individual'
    agency_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    real_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    vip_level: Optional[int] = None
    vip_expire_date: Optional[date] = None
    password: Optional[str] = None

class User(UserBase):
    user_id: int
    
    class Config:
        from_attributes = True

# 乘客相关模式
class PassengerBase(BaseModel):
    name: str
    id_card: str
    gender: Optional[str] = None
    birthday: Optional[date] = None
    nationality: str = "中国"
    contact_phone: Optional[str] = None

class PassengerCreate(PassengerBase):
    pass

class PassengerUpdate(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    birthday: Optional[date] = None
    nationality: Optional[str] = None
    contact_phone: Optional[str] = None

class Passenger(PassengerBase):
    passenger_id: int
    
    class Config:
        from_attributes = True

# 订单相关模式
class OrderBase(BaseModel):
    order_no: str
    user_id: int
    total_amount_original: Decimal
    total_amount: Decimal
    currency: str = 'CNY'
    payment_method: str = 'alipay'
    payment_status: str = 'unpaid'
    status: str = 'pending'
    expired_at: Optional[datetime] = None

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    payment_method: Optional[str] = None
    payment_status: Optional[str] = None
    status: Optional[str] = None
    paid_at: Optional[datetime] = None

class Order(OrderBase):
    order_id: int
    paid_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# 订单明细相关模式
class OrderItemBase(BaseModel):
    order_id: int
    flight_id: int
    cabin_class: str
    passenger_id: int
    original_price: Decimal
    paid_price: Decimal
    seat_number: Optional[str] = None
    check_in_status: str = 'not_checked'
    ticket_status: str = 'confirmed'

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemUpdate(BaseModel):
    seat_number: Optional[str] = None
    check_in_status: Optional[str] = None
    ticket_status: Optional[str] = None

class OrderItem(OrderItemBase):
    item_id: int
    
    class Config:
        from_attributes = True

# 值机相关模式
class CheckInBase(BaseModel):
    item_id: int
    passenger_id: int
    flight_id: int
    seat_number: str
    terminal: Optional[str] = None
    gate: Optional[str] = None
    boarding_time: Optional[datetime] = None

class CheckInCreate(CheckInBase):
    pass

class CheckInUpdate(BaseModel):
    seat_number: Optional[str] = None
    terminal: Optional[str] = None
    gate: Optional[str] = None
    boarding_time: Optional[datetime] = None

class CheckIn(CheckInBase):
    check_in_id: int
    checked_at: datetime
    
    class Config:
        from_attributes = True

# 认证相关模式
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
