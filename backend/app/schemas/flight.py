import enum
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import date, time
from enum import Enum
from .airline import Airline
from .route import RouteWithAirports


class FlightStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"


class CabinClass(str, Enum):
    """舱位类型枚举"""
    ECONOMY = "economy"
    BUSINESS = "business"
    FIRST = "first"


class FlightBase(BaseModel):
    route_id: int
    airline_code: str
    flight_number: str
    scheduled_departure_time: time
    scheduled_arrival_time: time
    economy_seats: int
    business_seats: int
    first_seats: int
    operating_days: str = Field("111111111111111111111", min_length=21, max_length=21, description="运营日期")
    # 废除 status 字段以避免枚举导致的响应校验问题


class FlightCreate(FlightBase):
    pass


class FlightUpdate(FlightBase):
    route_id: Optional[int] = None
    airline_code: Optional[str] = None
    flight_number: Optional[str] = None
    scheduled_departure_time: Optional[time] = None
    scheduled_arrival_time: Optional[time] = None
    economy_seats: Optional[int] = None
    business_seats: Optional[int] = None
    first_seats: Optional[int] = None
    operating_days: Optional[str] = Field(None, min_length=21, max_length=21)
    # 移除 status 可选字段


class FlightInDBBase(FlightBase):
    flight_id: int
    model_config = ConfigDict(from_attributes=True)


class Flight(FlightInDBBase):
    pass


class FlightWithDetails(FlightInDBBase):
    airline: Optional[Airline] = None
    route: Optional[RouteWithAirports] = None


class FlightPricingBase(BaseModel):
    flight_id: int = Field(..., description="航班ID")
    cabin_class: CabinClass = Field(..., description="舱位类型")
    base_price: float = Field(..., ge=0, description="基础价格")


class FlightPricingCreate(FlightPricingBase):
    pass


class FlightPricingUpdate(BaseModel):
    base_price: Optional[float] = Field(None, ge=0)


class FlightPricingInDBBase(FlightPricingBase):
    pricing_id: int
    model_config = ConfigDict(from_attributes=True)


class FlightPricing(FlightPricingInDBBase):
    pass


class FlightWithPricing(FlightWithDetails):
    pricing: List[FlightPricing] = []