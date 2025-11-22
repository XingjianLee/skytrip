"""
票务预订相关工具
供 BookingAgent 使用
"""
from langchain_core.tools import tool
from typing import Dict, List, Any, Optional
from database import db_manager


@tool
def get_flight_info_tool(flight_id: int) -> Dict:
    """
    根据航班ID获取完整的航班信息（包括价格和座位数）。

    Args:
        flight_id: 航班ID

    Returns:
        航班详细信息字典
    """
    try:
        flight = db_manager.get_flight_by_id(flight_id)
        return flight if flight else {"error": "航班不存在"}
    except Exception as e:
        return {"error": f"查询航班信息时发生错误: {str(e)}"}


@tool
def get_user_info_tool(user_id: int) -> Dict:
    """
    获取用户信息。

    Args:
        user_id: 用户ID

    Returns:
        用户信息字典
    """
    try:
        user = db_manager.get_user_by_id(user_id)
        return user if user else {"error": "用户不存在"}
    except Exception as e:
        return {"error": f"查询用户信息时发生错误: {str(e)}"}


@tool
def get_passenger_info_tool(id_card: str) -> Dict:
    """
    根据身份证号查询乘客信息。

    Args:
        id_card: 身份证号

    Returns:
        乘客信息字典，如果不存在则返回空字典
    """
    try:
        passenger = db_manager.get_passenger_by_id_card(id_card)
        return passenger if passenger else {}
    except Exception as e:
        return {"error": f"查询乘客信息时发生错误: {str(e)}"}


@tool
def create_passenger_tool(name: str, id_card: str, gender: Optional[str] = None,
                         birthday: Optional[str] = None, contact_phone: Optional[str] = None) -> Dict:
    """
    创建新的乘客信息。

    Args:
        name: 姓名
        id_card: 身份证号
        gender: 性别 (M/F/N)
        birthday: 出生日期 (YYYY-MM-DD)
        contact_phone: 联系电话

    Returns:
        包含乘客ID的字典
    """
    try:
        passenger_id = db_manager.create_passenger(name, id_card, gender, birthday, contact_phone)
        return {"passenger_id": passenger_id, "success": True}
    except Exception as e:
        return {"error": f"创建乘客信息时发生错误: {str(e)}"}


@tool
def create_order_tool(user_id: int, total_amount: float, 
                     total_amount_original: float, payment_method: str = 'alipay') -> Dict:
    """
    创建订单。

    Args:
        user_id: 用户ID
        total_amount: 实际支付金额
        total_amount_original: 原价
        payment_method: 支付方式 (alipay/wechat/unionpay/credit_card/offline)

    Returns:
        订单信息字典
    """
    try:
        order = db_manager.create_order(user_id, total_amount, total_amount_original, payment_method)
        return order
    except Exception as e:
        return {"error": f"创建订单时发生错误: {str(e)}"}


@tool
def create_order_item_tool(order_id: int, flight_id: int, cabin_class: str,
                          passenger_id: int, original_price: float, paid_price: float) -> Dict:
    """
    创建订单项（机票）。

    Args:
        order_id: 订单ID
        flight_id: 航班ID
        cabin_class: 舱位类型 (economy/business/first)
        passenger_id: 乘客ID
        original_price: 原价
        paid_price: 实际支付价格

    Returns:
        包含订单项ID的字典
    """
    try:
        item_id = db_manager.create_order_item(
            order_id, flight_id, cabin_class, passenger_id, original_price, paid_price
        )
        return {"item_id": item_id, "success": True}
    except Exception as e:
        return {"error": f"创建订单项时发生错误: {str(e)}"}


@tool
def update_order_payment_tool(order_id: int, payment_status: str) -> Dict:
    """
    更新订单支付状态。

    Args:
        order_id: 订单ID
        payment_status: 支付状态 (paid/unpaid/refunded/failed)

    Returns:
        操作结果字典
    """
    try:
        success = db_manager.update_order_payment_status(order_id, payment_status)
        return {"success": success, "message": "支付状态更新成功"}
    except Exception as e:
        return {"error": f"更新支付状态时发生错误: {str(e)}"}

