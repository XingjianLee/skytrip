"""
航班查询相关工具
供 FlightSearchAgent 使用
"""
from langchain_core.tools import tool
from typing import Dict, List, Any, Optional
from database import db_manager


@tool
def search_flights_advanced_tool(
    departure_city: str,
    arrival_city: str,
    departure_date: str,
    departure_time_start: str = "00:00:00",
    departure_time_end: str = "23:59:59",
    cabin_class: str = "economy",
    price_min: Optional[float] = None,
    price_max: Optional[float] = None,
    airline_code: Optional[str] = None
) -> List[Dict]:
    """
    高级航班搜索工具，支持舱位、价格区间、航空公司筛选。

    Args:
        departure_city: 出发城市 (e.g., "北京")
        arrival_city: 到达城市 (e.g., "上海")
        departure_date: 出发日期 (format: YYYY-MM-DD)
        departure_time_start: 出发时间开始 (format: HH:MM:SS, 默认 00:00:00)
        departure_time_end: 出发时间结束 (format: HH:MM:SS, 默认 23:59:59)
        cabin_class: 舱位类型，可选值: economy, business, first (默认 economy)
        price_min: 最低价格 (可选)
        price_max: 最高价格 (可选)
        airline_code: 航空公司代码，如 CA, MU, CZ (可选)

    Returns:
        按价格排序的航班信息列表
    """
    try:
        flights = db_manager.get_flights_by_requirement(
            departure_city=departure_city,
            arrival_city=arrival_city,
            departure_date=departure_date,
            departure_time_start=departure_time_start,
            departure_time_end=departure_time_end,
            cabin_class=cabin_class,
            price_min=price_min,
            price_max=price_max,
            airline_code=airline_code
        )
        return flights
    except Exception as e:
        return [{"error": f"查询航班时发生错误: {str(e)}"}]


@tool
def get_airport_codes_tool(city: str) -> List[Dict]:
    """
    获取指定城市的机场代码和名称。

    Args:
        city: 城市名称 (e.g., "北京")

    Returns:
        该城市的机场信息列表（包含机场代码和名称）
    """
    try:
        airports = db_manager.get_airport_codes_by_city(city)
        return airports
    except Exception as e:
        return [{"error": f"查询机场信息时发生错误: {str(e)}"}]


@tool
def get_available_cities_tool() -> List[str]:
    """
    获取所有可用的城市列表。

    Returns:
        可用城市名称列表（已排序）
    """
    try:
        routes = db_manager.get_available_routes()
        cities = set()
        for route in routes:
            cities.add(route.get('departure_city'))
            cities.add(route.get('arrival_city'))
        return sorted(list(cities))
    except Exception as e:
        return [f"查询城市列表时发生错误: {str(e)}"]


@tool
def get_available_routes_tool() -> List[Dict]:
    """
    获取所有可用航线。

    Returns:
        可用航线列表（包含出发城市和到达城市）
    """
    try:
        routes = db_manager.get_available_routes()
        return routes
    except Exception as e:
        return [{"error": f"查询航线信息时发生错误: {str(e)}"}]


@tool
def get_flight_by_number_tool(flight_number: str) -> List[Dict]:
    """
    根据航班号查询航班信息。

    Args:
        flight_number: 航班号，如 "CA1831"

    Returns:
        航班信息列表
    """
    try:
        connection = db_manager.get_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = """
        SELECT 
            f.flight_id,
            f.flight_number,
            al.airline_name,
            al.airline_code,
            a1.airport_name as departure_airport,
            a1.city as departure_city,
            a2.airport_name as arrival_airport,
            a2.city as arrival_city,
            f.scheduled_departure_time,
            f.scheduled_arrival_time,
            f.aircraft_type,
            fp.base_price as economy_price,
            COALESCE(fp_business.base_price, 0) as business_price,
            COALESCE(fp_first.base_price, 0) as first_price
        FROM flights f
        JOIN routes r ON f.route_id = r.route_id
        JOIN airports a1 ON r.departure_airport_code = a1.airport_code
        JOIN airports a2 ON r.arrival_airport_code = a2.airport_code
        JOIN flight_pricing fp ON f.flight_id = fp.flight_id AND fp.cabin_class = 'economy'
        LEFT JOIN flight_pricing fp_business ON f.flight_id = fp_business.flight_id AND fp_business.cabin_class = 'business'
        LEFT JOIN flight_pricing fp_first ON f.flight_id = fp_first.flight_id AND fp_first.cabin_class = 'first'
        JOIN airlines al ON f.airline_code = al.airline_code
        WHERE f.flight_number = %s
        AND f.status = 'active'
        """
        
        cursor.execute(query, (flight_number,))
        results = cursor.fetchall()
        cursor.close()
        connection.close()
        return results
    except Exception as e:
        return [{"error": f"查询航班信息时发生错误: {str(e)}"}]

