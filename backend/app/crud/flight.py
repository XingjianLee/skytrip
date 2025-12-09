from typing import List, Optional, Dict, Any
from datetime import date, time, datetime
from sqlalchemy.orm import Session, joinedload, aliased
from sqlalchemy import and_, or_, func
from app.crud.base import CRUDBase
from app.models.flight import Flight
from app.models.flight_pricing import FlightPricing, CabinClass
from app.models.route import Route
from app.models.airport import Airport
from app.models.airline import Airline
from app.models.order import Order, OrderItem, OrderStatus
from app.schemas.flight import FlightCreate, FlightUpdate
from app.schemas.flight_search import FlightSearchRequest, FlightSearchResult


class CRUDFlight(CRUDBase[Flight, FlightCreate, FlightUpdate]):
    """航班CRUD操作"""
    def get(self, db: Session, id: int) -> Optional[Flight]:
        """根据主键flight_id获取航班"""
        return db.query(Flight).filter(Flight.flight_id == id).first()
    
    def get_by_flight_number(self, db: Session, *, flight_number: str) -> Optional[Flight]:
        """根据航班号获取航班"""
        return db.query(Flight).filter(Flight.flight_number == flight_number).first()
    
    def get_by_airline(self, db: Session, *, airline_code: str) -> List[Flight]:
        """根据航空公司代码获取航班列表"""
        return db.query(Flight).filter(Flight.airline_code == airline_code).all()
    
    def get_by_route(self, db: Session, *, route_id: int) -> List[Flight]:
        """根据航线ID获取航班列表"""
        return db.query(Flight).filter(Flight.route_id == route_id).all()
    
    def get_with_details(self, db: Session, flight_id: int) -> Optional[Flight]:
        """获取包含详细信息的航班"""
        return db.query(Flight).options(
            joinedload(Flight.airline),
            joinedload(Flight.route).joinedload(Route.departure_airport),
            joinedload(Flight.route).joinedload(Route.arrival_airport),
            joinedload(Flight.pricing)
        ).filter(Flight.flight_id == flight_id).first()
    
    def search_flights(self, db: Session, *, request: FlightSearchRequest) -> List[Dict[str, Any]]:
        """基于地点与日期的航班搜索，忽略status，按21天掩码过滤并排序"""
        day_diff = (request.departure_date - date.today()).days
        if not (0 <= day_diff < 21):
            return []

        dep_airport = aliased(Airport, name='dep_airport')
        arr_airport = aliased(Airport, name='arr_airport')

        query = db.query(
            # 仅选择必要字段，避免加载 Flight.status
            Flight.flight_id,
            Flight.flight_number,
            Flight.scheduled_departure_time,
            Flight.scheduled_arrival_time,
            Flight.economy_seats,
            Flight.business_seats,
            Flight.first_seats,
            Route.route_id,
            dep_airport.airport_code.label('dep_code'),
            dep_airport.airport_name.label('dep_name'),
            dep_airport.city.label('dep_city'),
            arr_airport.airport_code.label('arr_code'),
            arr_airport.airport_name.label('arr_name'),
            arr_airport.city.label('arr_city'),
            Airline.airline_code,
            Airline.airline_name,
            FlightPricing.base_price
        ).join(
            Route, Flight.route_id == Route.route_id
        ).join(
            dep_airport, Route.departure_airport_code == dep_airport.airport_code
        ).join(
            arr_airport, Route.arrival_airport_code == arr_airport.airport_code
        ).join(
            Airline, Flight.airline_code == Airline.airline_code
        ).outerjoin(
            FlightPricing, FlightPricing.flight_id == Flight.flight_id
        ).filter(
            func.lower(dep_airport.city) == request.departure_city.lower(),
            func.lower(arr_airport.city) == request.arrival_city.lower(),
            func.substring(Flight.operating_days, day_diff + 1, 1) == '1'
        )

        # 舱位过滤（如果提供）
        if request.cabin_class is not None:
            # request.cabin_class 是 Pydantic 的枚举，使用其值（小写字符串）
            query = query.filter(FlightPricing.cabin_class == request.cabin_class.value)
        else:
            query = query.filter(FlightPricing.cabin_class == CabinClass.ECONOMY.value)

        # 价格区间过滤（如果提供）
        if request.price_min is not None:
            query = query.filter(FlightPricing.base_price >= request.price_min)
        if request.price_max is not None:
            query = query.filter(FlightPricing.base_price <= request.price_max)

        # 按计划起飞时刻排序（离当前时间最近）
        query = query.order_by(Flight.scheduled_departure_time.asc())

        return query.all()
    
    # 废弃旧函数：合并到新的 search_flights 中
    
    def get_available_seats(
        self,
        db: Session,
        *,
        flight_id: int,
        flight_date: date,
        cabin_class: CabinClass
    ) -> int:
        """获取指定航班与舱位的可用座位数（扣除未过期的pending与已支付订单项）"""
        flight = db.query(Flight).filter(Flight.flight_id == flight_id).first()
        if not flight:
            return 0

        # 总座位数
        if cabin_class == CabinClass.ECONOMY:
            total_seats = flight.economy_seats
        elif cabin_class == CabinClass.BUSINESS:
            total_seats = flight.business_seats
        elif cabin_class == CabinClass.FIRST:
            total_seats = flight.first_seats
        else:
            total_seats = 0

        # 已占用座位：订单项关联该航班、该舱位、该日期，订单状态为pending或paid，且未过期
        now = datetime.utcnow()
        occupied = db.query(func.count(OrderItem.item_id)).join(Order, OrderItem.order_id == Order.order_id).filter(
            OrderItem.flight_id == flight_id,
            OrderItem.cabin_class == cabin_class.value,
            or_(
                Order.status == OrderStatus.PENDING,
                Order.status == OrderStatus.PAID,
            ),
            or_(
                Order.expired_at.is_(None),
                Order.expired_at > now
            )
        ).scalar() or 0

        return max(total_seats - occupied, 0)
    
    def get_flights_with_pricing(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100
    ) -> List[Flight]:
        """获取包含定价信息的航班列表"""
        return db.query(Flight).options(
            joinedload(Flight.airline),
            joinedload(Flight.route).joinedload(Route.departure_airport),
            joinedload(Flight.route).joinedload(Route.arrival_airport),
            joinedload(Flight.pricing)
        ).offset(skip).limit(limit).all()


flight = CRUDFlight(Flight)
