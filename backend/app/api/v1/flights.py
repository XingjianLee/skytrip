from typing import List, Optional, Dict, Any
from datetime import date, time, datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from ... import dependencies as deps
from ... import crud, schemas
from ...models.flight_pricing import CabinClass

router = APIRouter()


@router.post("/search", response_model=schemas.FlightSearchResponse)
def search_flights(
    *,
    db: Session = Depends(deps.get_db),
    search_request: schemas.FlightSearchRequest
) -> Any:
    """
    搜索航班
    """
    try:
        # 搜索航班
        flights = crud.flight.search_flights(
            db,
            request=search_request
        )
        
        # 转换为搜索结果格式
        results = []
        for row in flights:
            (
                flight_id,
                flight_number,
                scheduled_departure_time,
                scheduled_arrival_time,
                economy_seats,
                business_seats,
                first_seats,
                route_id,
                dep_code,
                dep_name,
                dep_city,
                arr_code,
                arr_name,
                arr_city,
                airline_code,
                airline_name,
                base_price,
            ) = row
            
            # 检查总乘客数是否超过可用座位
            total_passengers = search_request.adult_count + search_request.child_count
            # 若未指定舱位，默认以经济舱计可用座；将 schema 的枚举转换为 model 的枚举
            if search_request.cabin_class:
                target_cabin = CabinClass[search_request.cabin_class.name]
            else:
                target_cabin = CabinClass.ECONOMY
            # 计算总座位数（不读取 Flight 实体，避免触发 status）
            if target_cabin == CabinClass.ECONOMY:
                total_seats = economy_seats
            elif target_cabin == CabinClass.BUSINESS:
                total_seats = business_seats
            else:
                total_seats = first_seats

            # 计算已占用座位（订单项未过期且状态为pending/paid）
            from ...models.order import Order, OrderItem, OrderStatus
            now = datetime.utcnow()
            occupied = db.query(func.count(OrderItem.item_id)).join(Order, OrderItem.order_id == Order.order_id).filter(
                OrderItem.flight_id == flight_id,
                OrderItem.cabin_class == target_cabin.value,
                or_(
                    Order.status == OrderStatus.PENDING,
                    Order.status == OrderStatus.PAID,
                ),
                or_(
                    Order.expired_at.is_(None),
                    Order.expired_at > now
                )
            ).scalar() or 0

            available_seats = max(total_seats - occupied, 0)
            if available_seats < total_passengers:
                continue

            # 计算到达日期
            arrival_date = search_request.departure_date
            if scheduled_arrival_time < scheduled_departure_time:
                arrival_date += timedelta(days=1)
            
            result = schemas.FlightSearchResult(
                flight_id=flight_id,
                flight_number=flight_number,
                airline_code=airline_code,
                airline_name=airline_name,
                departure_airport_code=dep_code,
                departure_airport_name=dep_name,
                departure_city=dep_city,
                arrival_airport_code=arr_code,
                arrival_airport_name=arr_name,
                arrival_city=arr_city,
                departure_date=search_request.departure_date,
                arrival_date=arrival_date,
                scheduled_departure_time=scheduled_departure_time,
                scheduled_arrival_time=scheduled_arrival_time,
                aircraft_type=None,
                cabin_class=schemas.CabinClass[target_cabin.name],
                base_price=float(base_price) if base_price is not None else 0.0,
                current_price=float(base_price) if base_price is not None else 0.0, # 简化：当前价格等于基础价格
                available_seats=available_seats,
            )
            results.append(result)
        
        # 构建响应统计
        all_prices = [f.current_price for f in results]
        airlines = list({r.airline_code for r in results})
        airports = list({r.departure_airport_code for r in results} | {r.arrival_airport_code for r in results})

        # 构建响应
        response = schemas.FlightSearchResponse(
            request=search_request,
            outbound_flights=results,
            total_count=len(results),
            min_price=min(all_prices) if all_prices else None,
            max_price=max(all_prices) if all_prices else None,
            airlines=airlines,
            airports=airports,
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"搜索航班时发生错误: {str(e)}")


@router.get("/{flight_id}", response_model=schemas.FlightWithDetails)
def get_flight_details(
    *,
    db: Session = Depends(deps.get_db),
    flight_id: int
) -> Any:
    """
    获取航班详细信息
    """
    flight = crud.flight.get_with_details(db, flight_id=flight_id)
    if not flight:
        raise HTTPException(status_code=404, detail="航班不存在")
    return flight


@router.get("/{flight_id}/availability", response_model=List[schemas.FlightAvailability])
def get_flight_availability(
    *,
    db: Session = Depends(deps.get_db),
    flight_id: int,
    flight_date: date = Query(..., description="航班日期")
) -> Any:
    """
    获取航班座位可用性
    """
    flight = crud.flight.get(db, id=flight_id)
    if not flight:
        raise HTTPException(status_code=404, detail="航班不存在")
    
    availability = []
    for cabin_class in CabinClass:
        available_seats = crud.flight.get_available_seats(
            db,
            flight_id=flight_id,
            flight_date=flight_date,
            cabin_class=cabin_class
        )
        
        availability.append(schemas.FlightAvailability(
            flight_id=flight_id,
            flight_date=flight_date,
            cabin_class=cabin_class,
            available_seats=available_seats
        ))
    
    return availability


@router.get("/", response_model=List[schemas.Flight])
def list_flights(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    airline_code: Optional[str] = None,
    flight_number: Optional[str] = None,
) -> Any:
    """
    获取航班列表（不使用status过滤）
    """
    query = db.query(crud.flight.model)
    if airline_code:
        query = query.filter(crud.flight.model.airline_code == airline_code)
    if flight_number:
        query = query.filter(crud.flight.model.flight_number.contains(flight_number))
    return query.offset(skip).limit(limit).all()


@router.get("/{flight_id}/pricing", response_model=List[schemas.FlightPricing])
def get_flight_pricing(
    *,
    db: Session = Depends(deps.get_db),
    flight_id: int
) -> Any:
    """
    获取航班定价信息
    """
    flight = crud.flight.get(db, id=flight_id)
    if not flight:
        raise HTTPException(status_code=404, detail="航班不存在")
    
    pricing = crud.flight_pricing.get_by_flight(db, flight_id=flight_id)
    return pricing