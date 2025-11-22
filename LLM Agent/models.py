from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class QueryRequest(BaseModel):
    query: str

class FlightInfo(BaseModel):
    flight_id: int
    flight_number: str
    airline_name: str
    departure_airport: str
    departure_city: str
    arrival_airport: str
    arrival_city: str
    scheduled_departure_time: str
    scheduled_arrival_time: str
    aircraft_type: Optional[str]
    economy_price: Optional[float]
    business_price: Optional[float]
    first_price: Optional[float]

class QueryResponse(BaseModel):
    message: str
    flights: List[FlightInfo] = []
    success: bool = True

class TravelRequirement(BaseModel):
    """旅行需求结构，由需求整理Agent生成（旧版，保留用于兼容）"""
    departure_city: Optional[str] = None  # 出发城市
    arrival_city: Optional[str] = None  # 到达城市
    departure_date: Optional[str] = None  # 出发日期，格式：YYYY-MM-DD
    departure_time_start: Optional[str] = None  # 出发时间开始，格式：HH:MM:SS
    departure_time_end: Optional[str] = None  # 出发时间结束，格式：HH:MM:SS
    cabin_class: Optional[str] = "economy"  # 舱位类型：economy, business, first
    price_min: Optional[float] = None  # 最低价格
    price_max: Optional[float] = None  # 最高价格
    airline_preference: Optional[str] = None  # 航空公司偏好
    notes: Optional[str] = None  # 其他备注信息


class TravelPlanRequirement(BaseModel):
    """完整的出行规划需求结构，由需求整理Agent生成"""
    
    # ========== 航班需求 ==========
    departure_city: Optional[str] = None  # 出发城市
    arrival_city: Optional[str] = None  # 到达城市
    departure_date: Optional[str] = None  # 出发日期，格式：YYYY-MM-DD
    departure_time_start: Optional[str] = None  # 预期出发时间开始，格式：HH:MM:SS
    departure_time_end: Optional[str] = None  # 预期出发时间结束，格式：HH:MM:SS
    arrival_date: Optional[str] = None  # 预期到达日期，格式：YYYY-MM-DD（如果跨天）
    arrival_time_start: Optional[str] = None  # 预期到达时间开始，格式：HH:MM:SS
    arrival_time_end: Optional[str] = None  # 预期到达时间结束，格式：HH:MM:SS
    cabin_class: Optional[str] = "economy"  # 舱位类型：economy（经济舱）, business（商务舱）, first（头等舱）
    flight_price_min: Optional[float] = None  # 航班最低价格（元）
    flight_price_max: Optional[float] = None  # 航班最高价格（元）
    airline_preference: Optional[str] = None  # 航空公司偏好（如：CA、MU、CZ、HU、3U）
    
    # ========== 出行需求等级 ==========
    travel_style: Optional[str] = "comfortable"  # 出行风格：economy（经济型）、comfortable（舒适型）、luxury（豪华型）
    
    # ========== 酒店需求 ==========
    need_hotel: Optional[bool] = False  # 是否需要酒店
    hotel_check_in_date: Optional[str] = None  # 酒店入住日期，格式：YYYY-MM-DD
    hotel_check_out_date: Optional[str] = None  # 酒店退房日期，格式：YYYY-MM-DD
    hotel_star_level: Optional[int] = None  # 酒店星级要求（3、4、5星）
    hotel_location_preference: Optional[str] = None  # 酒店位置偏好（如：市中心、机场附近、景区附近）
    hotel_price_min: Optional[float] = None  # 酒店最低价格（元/晚）
    hotel_price_max: Optional[float] = None  # 酒店最高价格（元/晚）
    hotel_amenities: Optional[List[str]] = []  # 酒店设施要求（如：["wifi", "parking", "gym", "pool"]）
    
    # ========== 其他需求 ==========
    passenger_count: Optional[int] = 1  # 出行人数
    special_requirements: Optional[List[str]] = []  # 特殊需求（如：["wifi", "wheelchair", "pet_friendly"]）
    budget_total: Optional[float] = None  # 总预算（元）
    notes: Optional[str] = None  # 其他备注信息
    
    def to_dict(self) -> Dict[str, Any]:
        """转换为标准字典格式，包含所有字段和默认值"""
        return {
            # 航班需求
            "departure_city": self.departure_city,
            "arrival_city": self.arrival_city,
            "departure_date": self.departure_date,
            "departure_time_start": self.departure_time_start or "00:00:00",
            "departure_time_end": self.departure_time_end or "23:59:59",
            "arrival_date": self.arrival_date,
            "arrival_time_start": self.arrival_time_start,
            "arrival_time_end": self.arrival_time_end,
            "cabin_class": self.cabin_class or "economy",
            "flight_price_min": self.flight_price_min,
            "flight_price_max": self.flight_price_max,
            "airline_preference": self.airline_preference,
            
            # 出行需求等级
            "travel_style": self.travel_style or "comfortable",
            
            # 酒店需求
            "need_hotel": self.need_hotel or False,
            "hotel_check_in_date": self.hotel_check_in_date,
            "hotel_check_out_date": self.hotel_check_out_date,
            "hotel_star_level": self.hotel_star_level,
            "hotel_location_preference": self.hotel_location_preference,
            "hotel_price_min": self.hotel_price_min,
            "hotel_price_max": self.hotel_price_max,
            "hotel_amenities": self.hotel_amenities or [],
            
            # 其他需求
            "passenger_count": self.passenger_count or 1,
            "special_requirements": self.special_requirements or [],
            "budget_total": self.budget_total,
            "notes": self.notes
        }