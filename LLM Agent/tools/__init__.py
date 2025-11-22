"""
工具模块
按功能分类的工具集合
"""

from .flight_tools import (
    search_flights_advanced_tool,
    get_airport_codes_tool,
    get_available_cities_tool,
    get_available_routes_tool,
    get_flight_by_number_tool,
)

from .booking_tools import (
    get_flight_info_tool,
    get_user_info_tool,
    get_passenger_info_tool,
    create_passenger_tool,
    create_order_tool,
    create_order_item_tool,
    update_order_payment_tool,
)

from .service_tools import (
    get_user_orders_tool,
    get_order_details_tool,
    get_order_items_tool,
    create_check_in_tool,
    get_check_in_info_tool,
    get_flight_info_for_checkin_tool,
)

from .user_tools import (
    get_user_profile_tool,
    update_user_phone_tool,
    update_user_email_tool,
    get_user_vip_info_tool,
)

from .travel_tools import (
    get_weather_tool,
    search_travel_info_tool,
    get_airport_info_tool,
)

__all__ = [
    # 航班工具
    'search_flights_advanced_tool',
    'get_airport_codes_tool',
    'get_available_cities_tool',
    'get_available_routes_tool',
    'get_flight_by_number_tool',
    # 预订工具
    'get_flight_info_tool',
    'get_user_info_tool',
    'get_passenger_info_tool',
    'create_passenger_tool',
    'create_order_tool',
    'create_order_item_tool',
    'update_order_payment_tool',
    # 服务工具
    'get_user_orders_tool',
    'get_order_details_tool',
    'get_order_items_tool',
    'create_check_in_tool',
    'get_check_in_info_tool',
    'get_flight_info_for_checkin_tool',
    # 用户工具
    'get_user_profile_tool',
    'update_user_phone_tool',
    'update_user_email_tool',
    'get_user_vip_info_tool',
    # 出行工具
    'get_weather_tool',
    'search_travel_info_tool',
    'get_airport_info_tool',
]

