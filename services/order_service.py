from collections import defaultdict
from datetime import datetime
from decimal import Decimal
from typing import Optional, Dict, Set

from sqlalchemy import and_, func, or_
from sqlalchemy.orm import Session

from app.models.flight import Flight
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.user import User

ALLOWED_STATUS_TRANSITIONS = {
    "pending": {"paid", "cancelled"},
    "paid": {"completed", "cancelled"},
    "cancelled": set(),
    "completed": set(),
}

ALLOWED_PAYMENT_TRANSITIONS = {
    "unpaid": {"paid", "failed"},
    "paid": {"refunded"},
    "refunded": set(),
    "failed": set(),
}


def assert_status_transition(current: str, target: Optional[str], transitions: Dict[str, Set[str]]):
    if target is None or target == current:
        return
    allowed = transitions.get(current, set())
    if target not in allowed:
        raise ValueError(f"非法状态流转：{current} -> {target}")


def ensure_inventory(order: Order, db: Session) -> None:
    """在订单从 pending -> paid 时检查库存."""
    if order.status != "pending":
        return
    for item in order.items:
        capacity_column = f"{item.cabin_class}_seats"
        flight: Flight = db.query(Flight).filter(Flight.flight_id == item.flight_id).with_for_update().one()
        capacity = getattr(flight, capacity_column)
        occupied = (
            db.query(func.count(OrderItem.item_id))
            .join(Order, Order.order_id == OrderItem.order_id)
            .filter(
                OrderItem.flight_id == item.flight_id,
                OrderItem.cabin_class == item.cabin_class,
                Order.status.in_(["paid", "completed"]),
            )
            .scalar()
        )
        if occupied >= capacity:
            raise ValueError(
                f"航班 {flight.flight_number} {item.cabin_class} 舱已无可售座位，现占用 {occupied}/{capacity}"
            )


def search_orders(
    db: Session,
    order_no: Optional[str] = None,
    user_id: Optional[int] = None,
    username: Optional[str] = None,
    status: Optional[str] = None,
    payment_status: Optional[str] = None,
    payment_method: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    min_amount: Optional[Decimal] = None,
    max_amount: Optional[Decimal] = None,
    page: int = 1,
    page_size: int = 20,
):
    """订单搜索与筛选"""
    query = db.query(Order).join(User, Order.user_id == User.id)

    # 构建筛选条件
    filters = []
    
    if order_no:
        filters.append(Order.order_no.like(f"%{order_no}%"))
    
    if user_id:
        filters.append(Order.user_id == user_id)
    
    if username:
        filters.append(User.username.like(f"%{username}%"))
    
    if status:
        filters.append(Order.status == status)
    
    if payment_status:
        filters.append(Order.payment_status == payment_status)
    
    if payment_method:
        filters.append(Order.payment_method == payment_method)
    
    if start_date:
        filters.append(Order.created_at >= start_date)
    
    if end_date:
        filters.append(Order.created_at <= end_date)
    
    if min_amount:
        filters.append(Order.total_amount >= min_amount)
    
    if max_amount:
        filters.append(Order.total_amount <= max_amount)

    if filters:
        query = query.filter(and_(*filters))

    # 计算总数
    total = query.count()

    # 分页
    offset = (page - 1) * page_size
    orders = query.order_by(Order.created_at.desc()).offset(offset).limit(page_size).all()

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
        "items": orders,
    }


def process_refund(order: Order, refund_amount: Optional[Decimal], db: Session) -> None:
    """处理订单退款"""
    if order.payment_status != "paid":
        raise ValueError("只有已支付的订单才能退款")
    
    if order.status == "cancelled":
        raise ValueError("已取消的订单不能退款")
    
    # 如果未指定退款金额，则全额退款
    if refund_amount is None:
        refund_amount = order.total_amount
    else:
        if refund_amount > order.total_amount:
            raise ValueError("退款金额不能超过订单金额")
        if refund_amount <= 0:
            raise ValueError("退款金额必须大于0")
    
    # 更新订单状态
    order.payment_status = "refunded"
    if refund_amount == order.total_amount:
        order.status = "cancelled"
    
    # 释放库存（如果是全额退款）
    if refund_amount == order.total_amount:
        for item in order.items:
            # 库存会在订单状态变为cancelled时自动释放
            item.ticket_status = "cancelled"
    
    db.commit()


def process_change(
    order: Order,
    new_flight_id: Optional[int],
    new_date: Optional[datetime],
    new_cabin_class: Optional[str],
    adjust_amount: Optional[Decimal],
    db: Session,
) -> None:
    """处理订单改签"""
    if order.status not in ["paid", "completed"]:
        raise ValueError("只有已支付或已完成的订单才能改签")
    
    if order.payment_status != "paid":
        raise ValueError("只有已支付的订单才能改签")
    
    # 检查新航班是否存在
    if new_flight_id:
        new_flight = db.query(Flight).filter(Flight.flight_id == new_flight_id).first()
        if not new_flight:
            raise ValueError("新航班不存在")
        if new_flight.status != "active":
            raise ValueError("新航班不可用")
    
    # 检查库存
    if new_flight_id and new_cabin_class:
        capacity_column = f"{new_cabin_class}_seats"
        flight = db.query(Flight).filter(Flight.flight_id == new_flight_id).with_for_update().first()
        capacity = getattr(flight, capacity_column)
        occupied = (
            db.query(func.count(OrderItem.item_id))
            .join(Order, Order.order_id == OrderItem.order_id)
            .filter(
                OrderItem.flight_id == new_flight_id,
                OrderItem.cabin_class == new_cabin_class,
                Order.status.in_(["paid", "completed"]),
            )
            .scalar()
        )
        if occupied >= capacity:
            raise ValueError(f"新航班 {flight.flight_number} {new_cabin_class} 舱已满")
    
    # 更新订单明细
    for item in order.items:
        if new_flight_id:
            item.flight_id = new_flight_id
        if new_cabin_class:
            item.cabin_class = new_cabin_class
            # 清空座位号，需要重新值机
            item.seat_number = None
            item.check_in_status = "not_checked"
    
    # 调整金额
    if adjust_amount is not None:
        order.total_amount += adjust_amount
        if order.total_amount < 0:
            raise ValueError("调整后金额不能为负数")
    
    db.commit()


