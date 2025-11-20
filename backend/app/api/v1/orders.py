from typing import List, Optional, Any
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_active_user
from app import crud, schemas, models

router = APIRouter()


@router.get("/", response_model=List[schemas.OrderWithItems])
def list_orders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
    status: Optional[schemas.OrderStatus] = Query(None, description="订单状态"),
    payment_status: Optional[schemas.PaymentStatus] = Query(None, description="支付状态"),
    start_date: Optional[date] = Query(None, description="开始日期"),
    end_date: Optional[date] = Query(None, description="结束日期")
) -> Any:
    """
    获取当前用户的订单列表
    """
    if status:
        # 仅返回当前用户的订单并按状态筛选
        orders_all = crud.order.get_by_user(db, user_id=current_user.id)
        orders = [
            o for o in orders_all
            if (o.status.value if hasattr(o.status, 'value') else str(o.status)) == status.value
        ]
    elif payment_status:
        # 仅返回当前用户的订单并按支付状态筛选
        orders_all = crud.order.get_by_user(db, user_id=current_user.id)
        orders = [
            o for o in orders_all
            if (o.payment_status.value if hasattr(o.payment_status, 'value') else str(o.payment_status)) == payment_status.value
        ]
    elif start_date and end_date:
        orders = crud.order.get_orders_by_date_range(
            db,
            start_date=start_date,
            end_date=end_date,
            user_id=current_user.id
        )
    else:
        orders = crud.order.get_by_user(db, user_id=current_user.id)
    
    # 获取包含订单项的订单信息
    orders_with_items = []
    for order in orders[skip:skip + limit]:
        order_with_items = crud.order.get_with_items(db, order_id=order.order_id)
        if order_with_items:
            orders_with_items.append(order_with_items)
    
    return orders_with_items


@router.get("/{order_id}", response_model=schemas.OrderWithItems)
def get_order(
    *,
    db: Session = Depends(get_db),
    order_id: int,
    current_user: models.User = Depends(get_current_active_user)
) -> Any:
    """
    根据订单ID获取订单详情
    """
    order = crud.order.get_with_items(db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="订单不存在")
    
    # 检查订单是否属于当前用户
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权访问此订单")
    
    return order


@router.post("/", response_model=schemas.OrderWithItems)
def create_order(
    *,
    db: Session = Depends(get_db),
    order_in: schemas.OrderCreate,
    current_user: models.User = Depends(get_current_active_user)
) -> Any:
    """创建新订单（含订单项），支持多人同航班或多个航班，座位校验与价格计算"""
    from sqlalchemy import select
    from sqlalchemy.orm import joinedload
    from decimal import Decimal
    from datetime import timedelta
    from app.models import flight_pricing as fp_model
    from app.models import passenger as passenger_model
    from app.models.order import Order as OrderModel, OrderItem as OrderItemModel, OrderStatus, PaymentStatus, PaymentMethod
    from app.schemas.passenger import PassengerCreate
    from app.models.flight_pricing import CabinClass
    from sqlalchemy import func

    # 聚合每个 (flight_id, cabin_class) 需占用的座位数
    seats_needed: dict[tuple[int, str], int] = {}
    for it in order_in.items:
        key = (it.flight_id, it.cabin_class.value)
        seats_needed[key] = seats_needed.get(key, 0) + 1

    # 校验航班存在与座位充足
    for (flight_id, cabin), count in seats_needed.items():
        flight = crud.flight.get(db, id=flight_id)
        if not flight:
            raise HTTPException(status_code=400, detail=f"航班 {flight_id} 不存在")
        # 计算可用座位（不按日期）：总座位 - 已占用（订单状态pending/paid且未过期的pending）
        if CabinClass(cabin) == CabinClass.ECONOMY:
            total_seats = flight.economy_seats
        elif CabinClass(cabin) == CabinClass.BUSINESS:
            total_seats = flight.business_seats
        else:
            total_seats = flight.first_seats

        now = datetime.utcnow()
        from app.models.order import Order as OrderModel, OrderItem as OrderItemModel, OrderStatus as ModelOrderStatus, PaymentStatus as ModelPaymentStatus
        occupied = db.query(func.count(OrderItemModel.item_id)).join(OrderModel, OrderItemModel.order_id == OrderModel.order_id).filter(
            OrderItemModel.flight_id == flight_id,
            OrderItemModel.cabin_class == cabin,
            (
                (
                    (OrderModel.payment_status == ModelPaymentStatus.UNPAID)
                    & (OrderModel.status == ModelOrderStatus.PENDING)
                    & ((OrderModel.expired_at.is_(None)) | (OrderModel.expired_at > now))
                )
                | (OrderModel.payment_status == ModelPaymentStatus.PAID)
            )
        ).scalar() or 0
        available = max(total_seats - occupied, 0)
        if available < count:
            raise HTTPException(status_code=409, detail=f"航班 {flight_id} 的 {cabin} 座位不足（可用 {available}，需求 {count}）")

    # 事务：创建订单与订单项
    try:
        # 价格查询缓存：每个 (flight_id,cabin) 的base_price
        price_cache: dict[tuple[int, str], Decimal] = {}
        def get_price(fid: int, cab: str) -> Decimal:
            key = (fid, cab)
            if key in price_cache:
                return price_cache[key]
            pricing = db.query(fp_model.FlightPricing).filter(fp_model.FlightPricing.flight_id==fid, fp_model.FlightPricing.cabin_class==cab).first()
            base = Decimal(pricing.base_price) if pricing else Decimal('0.00')
            price_cache[key] = base
            return base

        # 订单号
        now = datetime.utcnow()
        order_no = f"ORD{now.strftime('%Y%m%d%H%M%S')}"
        # 汇总金额
        total_original = Decimal('0.00')
        total_paid = Decimal('0.00')

        # 创建订单
        order_obj = OrderModel(
            order_no=order_no,
            user_id=current_user.id,
            total_amount_original=Decimal('0.00'),
            total_amount=Decimal('0.00'),
            currency='CNY',
            payment_method=PaymentMethod(order_in.payment_method.value),
            payment_status=PaymentStatus.UNPAID,
            status=OrderStatus.PENDING,
            expired_at=now + timedelta(minutes=30)
        )
        db.add(order_obj)
        db.flush()  # 获取order_id

        # 为每个item创建/获取乘客，并插入订单项
        for it in order_in.items:
            # 乘客：按 (id_card,name) 查找，若无则创建
            p = db.query(passenger_model.Passenger).filter(
                passenger_model.Passenger.id_card==it.passenger_info.id_card.upper(),
                passenger_model.Passenger.name==it.passenger_info.name
            ).first()
            if not p:
                p_in = PassengerCreate(
                    name=it.passenger_info.name,
                    id_card=it.passenger_info.id_card,
                    gender=it.passenger_info.gender,
                    birthday=it.passenger_info.birthday,
                    nationality=it.passenger_info.nationality,
                    contact_phone=it.passenger_info.contact_phone,
                )
                p = db.merge(passenger_model.Passenger(**p_in.dict()))
                db.flush()

            base_price = get_price(it.flight_id, it.cabin_class.value)
            total_original += base_price
            total_paid += base_price

            oi = OrderItemModel(
                order_id=order_obj.order_id,
                flight_id=it.flight_id,
                cabin_class=it.cabin_class.value,
                passenger_id=p.passenger_id,
                original_price=base_price,
                paid_price=base_price,
            )
            # 统一为同订单的联系邮箱（若提供）
            if order_in.contact_email:
                oi.contact_email = order_in.contact_email
            db.add(oi)

        # 更新订单金额
        order_obj.total_amount_original = total_original
        order_obj.total_amount = total_paid
        db.add(order_obj)
        db.commit()
        db.refresh(order_obj)

        # 返回包含订单项的订单
        result = crud.order.get_with_items(db, order_id=order_obj.order_id)
        return result
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"创建订单失败: {str(e)}")


@router.put("/{order_id}/payment", response_model=schemas.OrderWithItems)
def update_payment_status(
    *,
    db: Session = Depends(deps.get_db),
    order_id: int,
    payment_status: schemas.PaymentStatus,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    更新订单支付状态
    """
    order = crud.order.get(db, id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="订单不存在")
    
    # 检查订单是否属于当前用户
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权修改此订单")
    
    # 仅允许从未支付更新为已支付（注意字段类型可能为枚举或字符串）
    current_payment = order.payment_status.value if hasattr(order.payment_status, 'value') else str(order.payment_status)
    if current_payment == schemas.PaymentStatus.PAID.value:
        raise HTTPException(status_code=400, detail="订单已支付，无法重复支付")

    from app.models.order import PaymentStatus as ModelPaymentStatus
    updated = crud.order.update_payment_status(
        db,
        order_id=order_id,
        payment_status=ModelPaymentStatus(payment_status.value),
        payment_time=datetime.utcnow() if payment_status == schemas.PaymentStatus.PAID else None,
    )
    if not updated:
        raise HTTPException(status_code=500, detail="更新支付状态失败")
    return crud.order.get_with_items(db, order_id=order_id)


@router.put("/{order_id}/cancel", response_model=schemas.OrderWithItems)
def cancel_order(
    *,
    db: Session = Depends(deps.get_db),
    order_id: int,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    取消订单
    """
    order = crud.order.get(db, id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="订单不存在")
    
    # 检查订单是否属于当前用户
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权取消此订单")
    
    # 只能取消待支付或已支付的订单
    if order.status not in [schemas.OrderStatus.PENDING, schemas.OrderStatus.PAID]:
        raise HTTPException(status_code=400, detail="订单状态无法取消")

    cancelled = crud.order.cancel_order(db, order_id=order_id)
    if not cancelled:
        raise HTTPException(status_code=500, detail="取消订单失败")
    return crud.order.get_with_items(db, order_id=order_id)


@router.get("/{order_id}/items", response_model=List[schemas.OrderItemWithDetails])
def get_order_items(
    *,
    db: Session = Depends(deps.get_db),
    order_id: int,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    获取订单的订单项列表
    """
    order = crud.order.get(db, id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="订单不存在")
    
    # 检查订单是否属于当前用户
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权访问此订单")
    
    # 加载包含订单项与乘客、航班详情的订单，然后返回订单项列表
    order_with_items = crud.order.get_with_items(db, order_id=order_id)
    return order_with_items.items if order_with_items else []


@router.put("/items/{item_id}/check-in", response_model=schemas.OrderItem)
def update_check_in_status(
    *,
    db: Session = Depends(deps.get_db),
    item_id: int,
    check_in_status: schemas.CheckInStatus,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    更新订单项的值机状态
    """
    order_item = crud.order_item.get(db, id=item_id)
    if not order_item:
        raise HTTPException(status_code=404, detail="订单项不存在")
    
    # 检查订单是否属于当前用户
    order = crud.order.get(db, id=order_item.order_id)
    if not order or order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权修改此订单项")
    
    order_item = crud.order_item.update_check_in_status(
        db, 
        item_id=item_id, 
        check_in_status=check_in_status
    )
    return order_item


@router.put("/items/{item_id}/ticket", response_model=schemas.OrderItem)
def update_ticket_status(
    *,
    db: Session = Depends(deps.get_db),
    item_id: int,
    ticket_status: schemas.TicketStatus,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    更新订单项的票务状态
    """
    order_item = crud.order_item.get(db, id=item_id)
    if not order_item:
        raise HTTPException(status_code=404, detail="订单项不存在")
    
    # 检查订单是否属于当前用户
    order = crud.order.get(db, id=order_item.order_id)
    if not order or order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权修改此订单项")
    
    order_item = crud.order_item.update_ticket_status(
        db, 
        item_id=item_id, 
        ticket_status=ticket_status
    )
    return order_item


@router.get("/pending-payment", response_model=List[schemas.OrderWithItems])
def get_pending_payment_orders(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    获取待支付订单列表
    """
    orders = crud.order.get_pending_payment_orders(db)
    
    # 获取包含订单项的订单信息
    orders_with_items = []
    for order in orders:
        order_with_items = crud.order.get_with_items(db, order_id=order.order_id)
        if order_with_items:
            orders_with_items.append(order_with_items)
    
    return orders_with_items


@router.get("/expired", response_model=List[schemas.OrderWithItems])
def get_expired_orders(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    获取过期订单列表
    """
    orders = crud.order.get_expired_orders(db)
    
    # 获取包含订单项的订单信息
    orders_with_items = []
    for order in orders:
        order_with_items = crud.order.get_with_items(db, order_id=order.order_id)
        if order_with_items:
            orders_with_items.append(order_with_items)
    
    return orders_with_items