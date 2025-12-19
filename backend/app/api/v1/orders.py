from typing import List, Optional, Any
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, Query
import re
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, and_
from sqlalchemy import text

from ... import dependencies as deps
from ... import crud, schemas, models
from ...crud.order import order_item as order_item_crud
from ...crud.order import order_item as order_item_crud
from app.models import flight_pricing as fp_model

router = APIRouter()


@router.get("/", response_model=List[schemas.OrderWithItems])
def list_orders(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
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
    # 一次性加载订单及其订单项与航班详情，避免多次查询导致的异常
    orders = crud.order.get_user_orders_with_items(db, user_id=current_user.id, skip=skip, limit=limit)

    # 过滤条件（在内存中按枚举值进行比对）
    def to_val(x):
        return x.value if hasattr(x, 'value') else str(x)

    if status:
        orders = [o for o in orders if to_val(o.status) == status.value]
    if payment_status:
        orders = [o for o in orders if to_val(o.payment_status) == payment_status.value]
    if start_date and end_date:
        orders = [o for o in orders if (o.created_at.date() >= start_date and o.created_at.date() <= end_date)]

    return orders


@router.get("/{order_id}", response_model=schemas.OrderWithItems)
def get_order(
    *,
    db: Session = Depends(deps.get_db),
    order_id: int,
    current_user: models.User = Depends(deps.get_current_active_user)
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
    db: Session = Depends(deps.get_db),
    order_in: schemas.OrderCreate,
    current_user: models.User = Depends(deps.get_current_active_user)
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

            from datetime import datetime as _dt
            fd = None
            try:
                if getattr(it, 'flight_date', None):
                    fd = _dt.strptime(it.flight_date, "%Y-%m-%d").date()
            except Exception:
                fd = None
            oi = OrderItemModel(
                order_id=order_obj.order_id,
                flight_id=it.flight_id,
                cabin_class=it.cabin_class.value,
                passenger_id=p.passenger_id,
                original_price=base_price,
                paid_price=base_price,
                flight_date=fd,
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


@router.get("/{order_id}/cancel/preview")
def cancel_preview(
    *,
    db: Session = Depends(deps.get_db),
    order_id: int,
    flight_date: date,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    取消费用预览：根据所选航班日期判断是否收取 30% 手续费（距起飞 <24h），并校验运营掩码
    同时对已过期航班给出业务提示（仅支持改签）。
    """
    order = crud.order.get_with_items(db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="订单不存在")
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权访问此订单")

    from datetime import datetime
    now = datetime.utcnow()
    penalty_total = 0.0
    refund_total = 0.0
    items = []
    for it in order.items:
        flight = it.flight
        if not flight:
            continue
        day_diff = (flight_date - now.date()).days
        if day_diff < 0:
            raise HTTPException(status_code=400, detail="航班已过期仅支持改签")
        if day_diff >= 21:
            raise HTTPException(status_code=400, detail="航班日期不在运营掩码范围内")
        if flight.operating_days[day_diff] != '1':
            raise HTTPException(status_code=400, detail="所选日期航班未运营")
        dep_dt = datetime.combine(flight_date, flight.scheduled_departure_time)
        within_24h = (dep_dt - now).total_seconds() < 24 * 3600
        if dep_dt <= now:
            raise HTTPException(status_code=400, detail="航班已过期仅支持改签")
        paid = float(it.paid_price)
        penalty = paid * 0.30 if within_24h and paid > 0 else 0.0
        refund = paid - penalty if paid > 0 else 0.0
        penalty_total += penalty
        refund_total += refund
        items.append({
            "item_id": it.item_id,
            "paid_price": paid,
            "penalty": penalty,
            "refund": refund,
        })

    return {"penalty_total": penalty_total, "refund_total": refund_total, "items": items}

@router.put("/{order_id}/cancel", response_model=schemas.OrderWithItems)
def cancel_order(
    *,
    db: Session = Depends(deps.get_db),
    order_id: int,
    flight_date: Optional[date] = Query(None, description="航班日期，用于手续费计算与运营掩码校验"),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    取消订单，可选按航班日期计算 24 小时内的手续费（10%）并校验运营掩码
    """
    order = crud.order.get(db, id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="订单不存在")
    
    # 检查订单是否属于当前用户
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权取消此订单")
    
    # 只能取消待支付或已支付的订单（按值比较避免跨枚举类型不相等）
    current_status = order.status.value if hasattr(order.status, 'value') else str(order.status)
    if current_status not in [schemas.OrderStatus.PENDING.value, schemas.OrderStatus.PAID.value]:
        raise HTTPException(status_code=400, detail="订单状态无法取消")

    order_with_items = crud.order.get_with_items(db, order_id=order_id)
    if not order_with_items:
        raise HTTPException(status_code=404, detail="订单不存在")

    # 仅当提供 flight_date 时进行掩码与 24h 校验（当前返回体不含汇总，计算仅用于业务规则判断）
    from datetime import datetime
    now = datetime.utcnow()
    if flight_date is not None:
        for it in order_with_items.items:
            flight = it.flight
            if not flight:
                continue
            day_diff = (flight_date - now.date()).days
            if day_diff < 0:
                raise HTTPException(status_code=400, detail="航班已过期仅支持改签")
            if day_diff >= 21:
                raise HTTPException(status_code=400, detail="航班日期不在运营掩码范围内")
            if flight.operating_days[day_diff] != '1':
                raise HTTPException(status_code=400, detail="所选日期航班未运营")
            # 起飞时间
            dep_dt = datetime.combine(flight_date, flight.scheduled_departure_time)
            if dep_dt <= now:
                raise HTTPException(status_code=400, detail="航班已过期仅支持改签")
            _ = (dep_dt - now).total_seconds() < 24 * 3600  # 计算结果若需落库，可在此扩展

    # 更新订单状态
    cancelled = crud.order.cancel_order(db, order_id=order_id)
    if not cancelled:
        raise HTTPException(status_code=500, detail="取消订单失败")

    return crud.order.get_with_items(db, order_id=order_id)


@router.get("/stats/me", response_model=schemas.OrderStats)
def get_order_stats(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    获取当前用户的订单统计：总数、待支付、已支付、已完成、累计消费
    """
    now = datetime.utcnow()
    OrderModel = models.order.Order
    PaymentStatus = models.order.PaymentStatus
    OrderStatus = models.order.OrderStatus

    total_orders = db.query(func.count(OrderModel.order_id)).filter(OrderModel.user_id == current_user.id).scalar() or 0

    unpaid_count = db.query(func.count(OrderModel.order_id)).filter(
        OrderModel.user_id == current_user.id,
        OrderModel.payment_status == PaymentStatus.UNPAID.value,
        OrderModel.status == OrderStatus.PENDING.value,
        or_(OrderModel.expired_at.is_(None), OrderModel.expired_at > now)
    ).scalar() or 0

    paid_count = db.query(func.count(OrderModel.order_id)).filter(
        OrderModel.user_id == current_user.id,
        OrderModel.payment_status == PaymentStatus.PAID.value
    ).scalar() or 0

    completed_count = db.query(func.count(OrderModel.order_id)).filter(
        OrderModel.user_id == current_user.id,
        OrderModel.status == OrderStatus.COMPLETED.value
    ).scalar() or 0

    cancelled_count = db.query(func.count(OrderModel.order_id)).filter(
        OrderModel.user_id == current_user.id,
        OrderModel.status == OrderStatus.CANCELLED.value
    ).scalar() or 0

    total_spent = db.query(func.coalesce(func.sum(OrderModel.total_amount), 0)).filter(
        OrderModel.user_id == current_user.id,
        OrderModel.payment_status == PaymentStatus.PAID.value
    ).scalar() or 0.0

    return schemas.OrderStats(
        total_orders=total_orders,
        unpaid_count=unpaid_count,
        paid_count=paid_count,
        completed_count=completed_count,
        cancelled_count=cancelled_count,
        total_spent=float(total_spent),
    )


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
    seat_number: Optional[str] = Query(None, description="座位号"),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    更新订单项的值机状态
    """
    order_item = order_item_crud.get(db, id=item_id)
    if not order_item:
        raise HTTPException(status_code=404, detail="订单项不存在")
    
    # 检查订单是否属于当前用户
    order = crud.order.get(db, id=order_item.order_id)
    if not order or order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权修改此订单项")
    
    if seat_number is not None:
        sn = seat_number.upper().strip()
        if not re.fullmatch(r"\d{1,2}[A-F]", sn):
            raise HTTPException(status_code=400, detail="座位号格式错误")
        try:
            row = int(sn[:-1])
            col = sn[-1]
        except Exception:
            raise HTTPException(status_code=400, detail="座位号格式错误")
        cabin = str(order_item.cabin_class)
        if cabin == "first":
            if not (1 <= row <= 4 and col in {"A", "B"}):
                raise HTTPException(status_code=400, detail="座位与舱位不匹配")
        elif cabin == "business":
            if not (5 <= row <= 10 and col in {"A", "B", "D", "E"}):
                raise HTTPException(status_code=400, detail="座位与舱位不匹配")
        else:
            if not (11 <= row <= 30 and col in {"A", "B", "C", "D", "E", "F"}):
                raise HTTPException(status_code=400, detail="座位与舱位不匹配")
        existing = db.query(models.order.OrderItem).filter(
            models.order.OrderItem.flight_id == order_item.flight_id,
            models.order.OrderItem.seat_number == sn,
            models.order.OrderItem.item_id != item_id,
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="座位已被占用")
        order_item = order_item_crud.update_check_in_status(
            db,
            item_id=item_id,
            check_in_status=check_in_status,
            seat_number=sn,
        )
    else:
        order_item = order_item_crud.update_check_in_status(
            db,
            item_id=item_id,
            check_in_status=check_in_status,
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
    order_item = order_item_crud.get(db, id=item_id)
    if not order_item:
        raise HTTPException(status_code=404, detail="订单项不存在")
    
    # 检查订单是否属于当前用户
    order = crud.order.get(db, id=order_item.order_id)
    if not order or order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权修改此订单项")
    
    order_item = order_item_crud.update_ticket_status(
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
@router.put("/items/{item_id}/date", response_model=schemas.OrderItemWithDetails)
def update_order_item_date(
    *,
    db: Session = Depends(deps.get_db),
    item_id: int,
    flight_date: date,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    更新订单项的航班日期（同步到数据库）。
    若旧库缺少列，尝试自动添加列后再更新。
    """
    oi = crud.order_item.get_with_details(db, item_id=item_id)
    if not oi:
        raise HTTPException(status_code=404, detail="订单项不存在")
    if oi.order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权修改此订单项")
    try:
        # 尝试更新
        from app.models.order import OrderItem as OrderItemModel
        rec = db.query(OrderItemModel).filter(OrderItemModel.item_id == item_id).first()
        if rec is None:
            raise HTTPException(status_code=404, detail="订单项不存在")
        rec.flight_date = flight_date
        db.add(rec)
        db.commit()
        db.refresh(rec)
        ret = crud.order_item.get_with_details(db, item_id=item_id)
        return schemas.OrderItemWithDetails.model_validate(ret, from_attributes=True)
    except Exception:
        # 可能是旧库缺少列，尝试补列
        try:
            db.execute(text("ALTER TABLE order_items ADD COLUMN flight_date DATE NULL"))
            db.commit()
        except Exception:
            db.rollback()
            raise HTTPException(status_code=500, detail="数据库不支持自动添加航班日期列，请手动迁移")
        # 重试更新
        from app.models.order import OrderItem as OrderItemModel
        rec = db.query(OrderItemModel).filter(OrderItemModel.item_id == item_id).first()
        rec.flight_date = flight_date
        db.add(rec)
        db.commit()
        db.refresh(rec)
        ret = crud.order_item.get_with_details(db, item_id=item_id)
        return schemas.OrderItemWithDetails.model_validate(ret, from_attributes=True)
@router.put("/items/{item_id}/change", response_model=schemas.OrderItemWithDetails)
def update_order_item_change(
    *,
    db: Session = Depends(deps.get_db),
    item_id: int,
    flight_id: int,
    cabin_class: str,
    flight_date: date,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    改签提交：更新订单项的航班、舱位与日期，并按基础定价更新订单项价格与订单总额。
    """
    from app.models.order import OrderItem as OrderItemModel, Order as OrderModel
    # 加载订单项与订单归属校验
    oi = db.query(OrderItemModel).filter(OrderItemModel.item_id == item_id).first()
    if not oi:
        raise HTTPException(status_code=404, detail="订单项不存在")
    order = db.query(OrderModel).filter(OrderModel.order_id == oi.order_id).first()
    if not order or order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权修改此订单项")
    # 校验航班存在与舱位定价
    flight = crud.flight.get(db, id=flight_id)
    if not flight:
        raise HTTPException(status_code=400, detail="目标航班不存在")
    pricing = db.query(fp_model.FlightPricing).filter(fp_model.FlightPricing.flight_id == flight_id, fp_model.FlightPricing.cabin_class == cabin_class).first()
    if not pricing:
        raise HTTPException(status_code=400, detail="目标舱位无定价")
    # 更新订单项
    oi.flight_id = flight_id
    oi.cabin_class = cabin_class
    oi.flight_date = flight_date
    oi.paid_price = pricing.base_price
    db.add(oi)
    # 更新订单总额（按订单项 paid_price 汇总）
    items = db.query(OrderItemModel).filter(OrderItemModel.order_id == order.order_id).all()
    total = sum([float(x.paid_price or 0) for x in items])
    order.total_amount = total
    db.add(order)
    db.commit()
    db.refresh(oi)
    ret = order_item_crud.get_with_details(db, item_id=item_id)
    return schemas.OrderItemWithDetails.model_validate(ret, from_attributes=True)
