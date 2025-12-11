from typing import List, Optional, Any
from datetime import datetime, time
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import dependencies as deps
from app import crud, schemas, models

router = APIRouter()


@router.post("/", response_model=schemas.CheckIn)
def create_check_in(
    *,
    db: Session = Depends(deps.get_db),
    check_in_in: schemas.CheckInCreate,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    创建值机记录
    """
    # 验证订单项是否存在且属于当前用户
    order_item = crud.order_item.get(db, id=check_in_in.order_item_id)
    if not order_item:
        raise HTTPException(status_code=404, detail="订单项不存在")
    
    order = crud.order.get(db, id=order_item.order_id)
    if not order or order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权为此订单项办理值机")
    
    # 检查是否已经值机
    existing_check_in = crud.check_in.get_by_order_item(db, order_item_id=check_in_in.order_item_id)
    if existing_check_in:
        raise HTTPException(status_code=400, detail="该订单项已办理值机")
    
    # 检查座位是否可用
    if check_in_in.seat_number:
        seat_available = crud.check_in.check_seat_availability(
            db,
            flight_id=order_item.flight_id,
            flight_date=order_item.flight_date,
            seat_number=check_in_in.seat_number
        )
        if not seat_available:
            raise HTTPException(status_code=400, detail="座位已被占用")
    
    check_in = crud.check_in.create(db, obj_in=check_in_in)
    
    # 更新订单项的值机状态
    crud.order_item.update_check_in_status(
        db,
        item_id=check_in_in.order_item_id,
        check_in_status=schemas.CheckInStatus.CHECKED_IN
    )
    
    return check_in


@router.get("/{check_in_id}", response_model=schemas.CheckInWithDetails)
def get_check_in(
    *,
    db: Session = Depends(deps.get_db),
    check_in_id: int,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    根据值机ID获取值机详情
    """
    check_in = crud.check_in.get_with_details(db, check_in_id=check_in_id)
    if not check_in:
        raise HTTPException(status_code=404, detail="值机记录不存在")
    
    # 检查值机记录是否属于当前用户
    order_item = crud.order_item.get(db, id=check_in.order_item_id)
    if order_item:
        order = crud.order.get(db, id=order_item.order_id)
        if not order or order.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="无权访问此值机记录")
    
    return check_in


@router.put("/{check_in_id}", response_model=schemas.CheckIn)
def update_check_in(
    *,
    db: Session = Depends(deps.get_db),
    check_in_id: int,
    check_in_in: schemas.CheckInUpdate,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    更新值机信息
    """
    check_in = crud.check_in.get(db, id=check_in_id)
    if not check_in:
        raise HTTPException(status_code=404, detail="值机记录不存在")
    
    # 检查值机记录是否属于当前用户
    order_item = crud.order_item.get(db, id=check_in.order_item_id)
    if order_item:
        order = crud.order.get(db, id=order_item.order_id)
        if not order or order.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="无权修改此值机记录")
    
    # 如果更新座位号，检查座位是否可用
    if check_in_in.seat_number and check_in_in.seat_number != check_in.seat_number:
        seat_available = crud.check_in.check_seat_availability(
            db,
            flight_id=order_item.flight_id,
            flight_date=order_item.flight_date,
            seat_number=check_in_in.seat_number
        )
        if not seat_available:
            raise HTTPException(status_code=400, detail="座位已被占用")
    
    check_in = crud.check_in.update(db, db_obj=check_in, obj_in=check_in_in)
    return check_in


@router.delete("/{check_in_id}")
def cancel_check_in(
    *,
    db: Session = Depends(deps.get_db),
    check_in_id: int,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    取消值机
    """
    check_in = crud.check_in.get(db, id=check_in_id)
    if not check_in:
        raise HTTPException(status_code=404, detail="值机记录不存在")
    
    # 检查值机记录是否属于当前用户
    order_item = crud.order_item.get(db, id=check_in.order_item_id)
    if order_item:
        order = crud.order.get(db, id=order_item.order_id)
        if not order or order.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="无权取消此值机记录")
    
    # 更新订单项的值机状态
    crud.order_item.update_check_in_status(
        db,
        item_id=check_in.order_item_id,
        check_in_status=schemas.CheckInStatus.NOT_CHECKED_IN
    )
    
    crud.check_in.remove(db, id=check_in_id)
    return {"message": "值机取消成功"}


@router.get("/passenger/{passenger_id}", response_model=List[schemas.CheckInWithDetails])
def get_passenger_check_ins(
    *,
    db: Session = Depends(deps.get_db),
    passenger_id: int,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    获取乘客的值机记录列表
    """
    # 验证乘客是否属于当前用户的订单
    passenger = crud.passenger.get(db, id=passenger_id)
    if not passenger:
        raise HTTPException(status_code=404, detail="乘客不存在")
    
    check_ins = crud.check_in.get_by_passenger(db, passenger_id=passenger_id)
    
    # 过滤属于当前用户的值机记录
    user_check_ins = []
    for check_in in check_ins:
        check_in_details = crud.check_in.get_with_details(db, check_in_id=check_in.check_in_id)
        if check_in_details:
            order_item = crud.order_item.get(db, id=check_in_details.order_item_id)
            if order_item:
                order = crud.order.get(db, id=order_item.order_id)
                if order and order.user_id == current_user.id:
                    user_check_ins.append(check_in_details)
    
    return user_check_ins


@router.get("/flight/{flight_id}/seats", response_model=List[str])
def get_occupied_seats(
    *,
    db: Session = Depends(deps.get_db),
    flight_id: int,
    flight_date: str = Query(..., description="航班日期 (YYYY-MM-DD)")
) -> Any:
    """
    获取航班已占用的座位列表
    """
    try:
        flight_date_obj = datetime.strptime(flight_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="日期格式错误，请使用 YYYY-MM-DD 格式")
    
    flight = crud.flight.get(db, id=flight_id)
    if not flight:
        raise HTTPException(status_code=404, detail="航班不存在")
    
    occupied_seats = crud.check_in.get_occupied_seats(db, flight_id=flight_id, flight_date=flight_date_obj)
    return occupied_seats


@router.post("/seat-selection", response_model=schemas.SeatSelection)
def select_seat(
    *,
    db: Session = Depends(deps.get_db),
    seat_selection: schemas.SeatSelection,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    选择座位
    """
    # 验证订单项是否存在且属于当前用户
    order_item = crud.order_item.get(db, id=seat_selection.order_item_id)
    if not order_item:
        raise HTTPException(status_code=404, detail="订单项不存在")
    
    order = crud.order.get(db, id=order_item.order_id)
    if not order or order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权为此订单项选择座位")
    
    # 检查座位是否可用
    seat_available = crud.check_in.check_seat_availability(
        db,
        flight_id=order_item.flight_id,
        flight_date=order_item.flight_date,
        seat_number=seat_selection.seat_number
    )
    if not seat_available:
        raise HTTPException(status_code=400, detail="座位已被占用")
    
    # 检查是否已有值机记录
    existing_check_in = crud.check_in.get_by_order_item(db, order_item_id=seat_selection.order_item_id)
    if existing_check_in:
        # 更新座位号
        check_in_update = schemas.CheckInUpdate(seat_number=seat_selection.seat_number)
        crud.check_in.update(db, db_obj=existing_check_in, obj_in=check_in_update)
    else:
        # 创建值机记录
        check_in_create = schemas.CheckInCreate(
            order_item_id=seat_selection.order_item_id,
            seat_number=seat_selection.seat_number
        )
        crud.check_in.create(db, obj_in=check_in_create)
    
    return seat_selection


@router.get("/boarding-pass/{check_in_id}", response_model=schemas.BoardingPass)
def get_boarding_pass(
    *,
    db: Session = Depends(deps.get_db),
    check_in_id: int,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    获取登机牌信息
    """
    check_in = crud.check_in.get_with_details(db, check_in_id=check_in_id)
    if not check_in:
        raise HTTPException(status_code=404, detail="值机记录不存在")
    
    # 检查值机记录是否属于当前用户
    order_item = crud.order_item.get(db, id=check_in.order_item_id)
    if order_item:
        order = crud.order.get(db, id=order_item.order_id)
        if not order or order.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="无权访问此登机牌")
    
    # 构建登机牌信息
    boarding_pass = schemas.BoardingPass(
        check_in_id=check_in.check_in_id,
        passenger_name=check_in.passenger.name if check_in.passenger else "",
        flight_number=check_in.flight.flight_number if check_in.flight else "",
        departure_airport=check_in.flight.route.departure_airport.airport_name if check_in.flight and check_in.flight.route and check_in.flight.route.departure_airport else "",
        arrival_airport=check_in.flight.route.arrival_airport.airport_name if check_in.flight and check_in.flight.route and check_in.flight.route.arrival_airport else "",
        departure_time=check_in.flight.scheduled_departure_time if check_in.flight else None,
        arrival_time=check_in.flight.scheduled_arrival_time if check_in.flight else None,
        seat_number=check_in.seat_number,
        gate=check_in.gate,
        terminal=check_in.terminal,
        boarding_time=check_in.boarding_time
    )
    
    return boarding_pass


@router.put("/{check_in_id}/boarding", response_model=schemas.CheckIn)
def update_boarding_info(
    *,
    db: Session = Depends(deps.get_db),
    check_in_id: int,
    gate: Optional[str] = Query(None, description="登机口"),
    terminal: Optional[str] = Query(None, description="航站楼"),
    boarding_time: Optional[time] = Query(None, description="登机时间"),
    # current_user: models.User = Depends(deps.get_current_active_superuser)  # 需要管理员权限
) -> Any:
    """
    更新登机信息（管理员功能）
    """
    check_in = crud.check_in.get(db, id=check_in_id)
    if not check_in:
        raise HTTPException(status_code=404, detail="值机记录不存在")
    
    boarding_info = {
        "gate": gate,
        "terminal": terminal,
        "boarding_time": boarding_time
    }
    
    # 过滤掉None值
    boarding_info = {k: v for k, v in boarding_info.items() if v is not None}
    
    check_in = crud.check_in.update_boarding_info(db, check_in_id=check_in_id, **boarding_info)
    return check_in