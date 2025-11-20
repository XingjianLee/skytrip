from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import date, time
from app.schemas.flight import CabinClass


class FlightSearchRequest(BaseModel):
    departure_city: str
    arrival_city: str
    departure_date: date
    cabin_class: Optional[CabinClass] = None
    adult_count: int = Field(1, ge=1)
    child_count: int = Field(0, ge=0)
    infant_count: int = Field(0, ge=0)
    price_min: Optional[float] = Field(None, ge=0)
    price_max: Optional[float] = Field(None, ge=0)

    @field_validator("cabin_class", mode="before")
    def lowercase_cabin_class(cls, v):
        if v:
            return v.lower()
        return v

    @field_validator("departure_date")
    def validate_departure_date(cls, v):
        if v < date.today():
            raise ValueError("Departure date cannot be in the past")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "departure_city": "上海",
                "arrival_city": "广州",
                "departure_date": "2025-11-04",
                "cabin_class": "economy",
                "adult_count": 1,
                "child_count": 0,
                "price_min": 200.0,
                "price_max": 1200.0
            }
        }


class FlightSearchResult(BaseModel):
    """单个航班搜索结果"""
    flight_id: int = Field(..., description="航班ID")
    flight_number: str = Field(..., description="航班号")
    airline_code: str = Field(..., description="航空公司代码")
    airline_name: str = Field(..., description="航空公司名称")
    
    # 航线信息
    departure_airport_code: str = Field(..., description="出发机场代码")
    departure_airport_name: str = Field(..., description="出发机场名称")
    departure_city: str = Field(..., description="出发城市")
    arrival_airport_code: str = Field(..., description="到达机场代码")
    arrival_airport_name: str = Field(..., description="到达机场名称")
    arrival_city: str = Field(..., description="到达城市")
    
    # 日期与时刻
    departure_date: date = Field(..., description="出发日期")
    arrival_date: date = Field(..., description="到达日期")
    scheduled_departure_time: time = Field(..., description="计划起飞时刻")
    scheduled_arrival_time: time = Field(..., description="计划到达时刻")
    
    # 机型和座位信息
    aircraft_type: Optional[str] = Field(None, description="机型")
    available_seats: int = Field(..., description="可用座位数")
    
    # 价格信息
    base_price: float = Field(..., description="基础价格")
    current_price: float = Field(..., description="当前价格（含税费）")
    
    # 舱位信息
    cabin_class: CabinClass = Field(..., description="舱位类型")


class FlightSearchResponse(BaseModel):
    """航班搜索响应模型"""
    request: FlightSearchRequest = Field(..., description="搜索请求")
    outbound_flights: List[FlightSearchResult] = Field([], description="航班结果")
    total_count: int = Field(0, description="总结果数量")
    
    # 搜索统计信息
    min_price: Optional[float] = Field(None, description="最低价格")
    max_price: Optional[float] = Field(None, description="最高价格")
    airlines: List[str] = Field([], description="涉及的航空公司")
    airports: List[str] = Field([], description="涉及的机场")


class FlightAvailability(BaseModel):
    """航班座位可用性模型"""
    flight_id: int = Field(..., description="航班ID")
    flight_date: date = Field(..., description="航班日期")
    cabin_class: CabinClass = Field(..., description="舱位")
    available_seats: int = Field(..., description="可用座位数")