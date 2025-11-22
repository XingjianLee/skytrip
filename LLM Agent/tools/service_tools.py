"""
行程服务相关工具
供 ServiceAgent 使用
"""
from langchain_core.tools import tool
from typing import Dict, List, Any, Optional
from database import db_manager


@tool
def get_user_orders_tool(user_id: int) -> List[Dict]:
    """
    获取用户的所有订单列表。

    Args:
        user_id: 用户ID

    Returns:
        订单列表
    """
    try:
        orders = db_manager.get_orders_by_user(user_id)
        return orders
    except Exception as e:
        return [{"error": f"查询订单时发生错误: {str(e)}"}]


@tool
def get_order_details_tool(order_id: int) -> Dict:
    """
    获取订单的详细信息（包括订单项）。

    Args:
        order_id: 订单ID

    Returns:
        包含订单和订单项的完整信息
    """
    try:
        connection = db_manager.get_connection()
        cursor = connection.cursor(dictionary=True)
        
        # 获取订单信息
        query = "SELECT * FROM orders WHERE order_id = %s"
        cursor.execute(query, (order_id,))
        order = cursor.fetchone()
        
        if not order:
            cursor.close()
            connection.close()
            return {"error": "订单不存在"}
        
        # 获取订单项
        items = db_manager.get_order_items_by_order(order_id)
        
        cursor.close()
        connection.close()
        
        return {
            "order": order,
            "items": items
        }
    except Exception as e:
        return {"error": f"查询订单详情时发生错误: {str(e)}"}


@tool
def get_order_items_tool(order_id: int) -> List[Dict]:
    """
    获取订单的所有订单项（机票）。

    Args:
        order_id: 订单ID

    Returns:
        订单项列表
    """
    try:
        items = db_manager.get_order_items_by_order(order_id)
        return items
    except Exception as e:
        return [{"error": f"查询订单项时发生错误: {str(e)}"}]


@tool
def create_check_in_tool(item_id: int, passenger_id: int, flight_id: int,
                        seat_number: str, terminal: Optional[str] = None,
                        gate: Optional[str] = None, boarding_time: Optional[str] = None) -> Dict:
    """
    办理值机，分配座位。

    Args:
        item_id: 订单项ID
        passenger_id: 乘客ID
        flight_id: 航班ID
        seat_number: 座位号（如 "15C"）
        terminal: 航站楼（如 "T3"）
        gate: 登机口（如 "C21"）
        boarding_time: 登机时间（格式：YYYY-MM-DD HH:MM:SS）

    Returns:
        值机信息字典
    """
    try:
        check_in_id = db_manager.create_check_in(
            item_id, passenger_id, flight_id, seat_number, terminal, gate, boarding_time
        )
        return {"check_in_id": check_in_id, "success": True, "seat_number": seat_number}
    except Exception as e:
        return {"error": f"办理值机时发生错误: {str(e)}"}


@tool
def get_check_in_info_tool(item_id: int) -> Dict:
    """
    获取值机信息。

    Args:
        item_id: 订单项ID

    Returns:
        值机信息字典
    """
    try:
        check_in = db_manager.get_check_in_by_item(item_id)
        return check_in if check_in else {"error": "未找到值机信息"}
    except Exception as e:
        return {"error": f"查询值机信息时发生错误: {str(e)}"}


@tool
def get_flight_info_for_checkin_tool(flight_id: int) -> Dict:
    """
    获取航班信息（用于值机时显示登机信息）。

    Args:
        flight_id: 航班ID

    Returns:
        航班信息字典
    """
    try:
        flight = db_manager.get_flight_by_id(flight_id)
        return flight if flight else {"error": "航班不存在"}
    except Exception as e:
        return {"error": f"查询航班信息时发生错误: {str(e)}"}

