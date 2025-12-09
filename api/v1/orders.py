from datetime import datetime
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, selectinload

from app.api import deps
from app.models.flight import Flight
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.passenger import Passenger
from app.models.user import User
from app.schemas.order import (
    OrderChangeRequest,
    OrderDetailResponse,
    OrderListResponse,
    OrderRefundRequest,
    OrderResponse,
    OrderSearchParams,
    OrderUpdate,
)
from app.services.order_service import (
    ALLOWED_PAYMENT_TRANSITIONS,
    ALLOWED_STATUS_TRANSITIONS,
    assert_status_transition,
    ensure_inventory,
    process_change,
    process_refund,
    search_orders,
)

router = APIRouter()


@router.get("/", response_model=OrderListResponse)
def list_orders(
    order_no: Optional[str] = Query(None, description="订单号（支持模糊搜索）"),
    user_id: Optional[int] = Query(None, description="用户ID"),
    username: Optional[str] = Query(None, description="用户名（支持模糊搜索）"),
    status: Optional[str] = Query(None, description="订单状态"),
    payment_status: Optional[str] = Query(None, description="支付状态"),
    payment_method: Optional[str] = Query(None, description="支付方式"),
    start_date: Optional[datetime] = Query(None, description="开始日期"),
    end_date: Optional[datetime] = Query(None, description="结束日期"),
    min_amount: Optional[Decimal] = Query(None, description="最小金额"),
    max_amount: Optional[Decimal] = Query(None, description="最大金额"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    db: Session = Depends(deps.get_db_session),
    _: User = Depends(deps.get_current_admin),
):
    """订单列表（支持搜索和筛选）"""
    result = search_orders(
        db=db,
        order_no=order_no,
        user_id=user_id,
        username=username,
        status=status,
        payment_status=payment_status,
        payment_method=payment_method,
        start_date=start_date,
        end_date=end_date,
        min_amount=min_amount,
        max_amount=max_amount,
        page=page,
        page_size=page_size,
    )
    
    # 填充用户名
    for order in result["items"]:
        user = db.query(User).filter(User.id == order.user_id).first()
        if user:
            order.username = user.username
    
    return OrderListResponse(
        total=result["total"],
        page=result["page"],
        page_size=result["page_size"],
        total_pages=result["total_pages"],
        items=result["items"],
    )


@router.get("/{order_id}", response_model=OrderDetailResponse)
def get_order_detail(
    order_id: int,
    db: Session = Depends(deps.get_db_session),
    _: User = Depends(deps.get_current_admin),
):
    """获取订单详情"""
    order = (
        db.query(Order)
        .options(selectinload(Order.items))
        .filter(Order.order_id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在")
    
    # 获取用户信息
    user = db.query(User).filter(User.id == order.user_id).first()
    
    # 获取订单明细详情
    items_detail = []
    for item in order.items:
        flight = db.query(Flight).filter(Flight.flight_id == item.flight_id).first()
        passenger = db.query(Passenger).filter(Passenger.passenger_id == item.passenger_id).first()
        
        items_detail.append({
            "item_id": item.item_id,
            "flight_id": item.flight_id,
            "flight_number": flight.flight_number if flight else None,
            "cabin_class": item.cabin_class,
            "passenger_id": item.passenger_id,
            "passenger_name": passenger.name if passenger else None,
            "original_price": item.original_price,
            "paid_price": item.paid_price,
            "seat_number": item.seat_number,
            "check_in_status": item.check_in_status,
            "ticket_status": item.ticket_status,
        })
    
    return OrderDetailResponse(
        order_id=order.order_id,
        order_no=order.order_no,
        user_id=order.user_id,
        username=user.username if user else None,
        user_email=user.email if user else None,
        total_amount=order.total_amount,
        total_amount_original=order.total_amount_original,
        currency=order.currency,
        payment_method=order.payment_method,
        payment_status=order.payment_status,
        status=order.status,
        created_at=order.created_at,
        paid_at=order.paid_at,
        expired_at=order.expired_at,
        updated_at=order.updated_at,
        items=items_detail,
    )


@router.post("/{order_id}/refund", response_model=OrderDetailResponse)
def refund_order(
    order_id: int,
    payload: OrderRefundRequest,
    db: Session = Depends(deps.get_db_session),
    _: User = Depends(deps.get_current_admin),
):
    """订单退款"""
    order = (
        db.query(Order)
        .options(selectinload(Order.items))
        .filter(Order.order_id == order_id)
        .with_for_update()
        .first()
    )
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在")
    
    try:
        process_refund(order, payload.refund_amount, db)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    
    db.refresh(order)
    return get_order_detail(order_id, db, _)


@router.post("/{order_id}/change", response_model=OrderDetailResponse)
def change_order(
    order_id: int,
    payload: OrderChangeRequest,
    db: Session = Depends(deps.get_db_session),
    _: User = Depends(deps.get_current_admin),
):
    """订单改签"""
    order = (
        db.query(Order)
        .options(selectinload(Order.items))
        .filter(Order.order_id == order_id)
        .with_for_update()
        .first()
    )
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在")
    
    try:
        process_change(
            order=order,
            new_flight_id=payload.new_flight_id,
            new_date=payload.new_date,
            new_cabin_class=payload.new_cabin_class,
            adjust_amount=payload.adjust_amount,
            db=db,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    
    db.refresh(order)
    return get_order_detail(order_id, db, _)


@router.put("/{order_id}", response_model=OrderDetailResponse)
def update_order(
    order_id: int,
    payload: OrderUpdate,
    db: Session = Depends(deps.get_db_session),
    _: User = Depends(deps.get_current_admin),
):
    """更新订单状态"""
    order = (
        db.query(Order)
        .options(selectinload(Order.items))
        .filter(Order.order_id == order_id)
        .with_for_update()
        .first()
    )
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在")
    try:
        assert_status_transition(order.status, payload.status, ALLOWED_STATUS_TRANSITIONS)
        assert_status_transition(
            order.payment_status, payload.payment_status, ALLOWED_PAYMENT_TRANSITIONS
        )
        if payload.status == "paid":
            ensure_inventory(order, db)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    if payload.total_amount:
        if payload.total_amount <= 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="金额必须大于0")
        order.total_amount = payload.total_amount
    if payload.status:
        order.status = payload.status
    if payload.payment_status:
        order.payment_status = payload.payment_status
    db.commit()
    db.refresh(order)
    return get_order_detail(order_id, db, _)


