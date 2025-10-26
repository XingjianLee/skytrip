from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db import models
from app import schemas
from app.core.security import get_password_hash, verify_password, create_access_token
from datetime import timedelta
from app.core.config import settings

router = APIRouter()

# 航空公司相关端点
@router.get("/airlines/", response_model=List[schemas.Airline])
def read_airlines(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    airlines = db.query(models.Airline).offset(skip).limit(limit).all()
    return airlines

@router.get("/airlines/{airline_code}", response_model=schemas.Airline)
def read_airline(airline_code: str, db: Session = Depends(get_db)):
    db_airline = db.query(models.Airline).filter(models.Airline.airline_code == airline_code).first()
    if db_airline is None:
        raise HTTPException(status_code=404, detail="航空公司不存在")
    return db_airline

@router.post("/airlines/", response_model=schemas.Airline)
def create_airline(airline: schemas.AirlineCreate, db: Session = Depends(get_db)):
    # 检查航空公司代码是否已存在
    db_airline = db.query(models.Airline).filter(models.Airline.airline_code == airline.airline_code).first()
    if db_airline:
        raise HTTPException(
            status_code=400,
            detail="航空公司代码已存在"
        )
    
    db_airline = models.Airline(**airline.dict())
    db.add(db_airline)
    db.commit()
    db.refresh(db_airline)
    return db_airline

@router.put("/airlines/{airline_code}", response_model=schemas.Airline)
def update_airline(airline_code: str, airline: schemas.AirlineUpdate, db: Session = Depends(get_db)):
    db_airline = db.query(models.Airline).filter(models.Airline.airline_code == airline_code).first()
    if db_airline is None:
        raise HTTPException(status_code=404, detail="航空公司不存在")
    
    update_data = airline.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_airline, field, value)
    
    db.commit()
    db.refresh(db_airline)
    return db_airline

@router.delete("/airlines/{airline_code}")
def delete_airline(airline_code: str, db: Session = Depends(get_db)):
    db_airline = db.query(models.Airline).filter(models.Airline.airline_code == airline_code).first()
    if db_airline is None:
        raise HTTPException(status_code=404, detail="航空公司不存在")
    
    db.delete(db_airline)
    db.commit()
    return {"message": "航空公司已删除"}

# 机场相关端点
@router.get("/airports/", response_model=List[schemas.Airport])
def read_airports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    airports = db.query(models.Airport).offset(skip).limit(limit).all()
    return airports

@router.get("/airports/{airport_code}", response_model=schemas.Airport)
def read_airport(airport_code: str, db: Session = Depends(get_db)):
    db_airport = db.query(models.Airport).filter(models.Airport.airport_code == airport_code).first()
    if db_airport is None:
        raise HTTPException(status_code=404, detail="机场不存在")
    return db_airport

# 航线相关端点
@router.get("/routes/", response_model=List[schemas.Route])
def read_routes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    routes = db.query(models.Route).offset(skip).limit(limit).all()
    return routes

@router.get("/routes/{route_id}", response_model=schemas.Route)
def read_route(route_id: int, db: Session = Depends(get_db)):
    db_route = db.query(models.Route).filter(models.Route.route_id == route_id).first()
    if db_route is None:
        raise HTTPException(status_code=404, detail="航线不存在")
    return db_route

# 航班相关端点
@router.get("/flights/", response_model=List[schemas.Flight])
def read_flights(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    flights = db.query(models.Flight).offset(skip).limit(limit).all()
    return flights

@router.get("/flights/{flight_id}", response_model=schemas.Flight)
def read_flight(flight_id: int, db: Session = Depends(get_db)):
    db_flight = db.query(models.Flight).filter(models.Flight.flight_id == flight_id).first()
    if db_flight is None:
        raise HTTPException(status_code=404, detail="航班不存在")
    return db_flight

# 用户相关端点
@router.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="用户不存在")
    return db_user

@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 检查用户名是否已存在
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="用户名已存在"
        )
    
    # 检查身份证是否已存在
    db_user = db.query(models.User).filter(models.User.id_card == user.id_card).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="身份证号已存在"
        )
    
    # 创建新用户
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        phone=user.phone,
        email=user.email,
        password=hashed_password,
        real_name=user.real_name,
        id_card=user.id_card,
        avatar_url=user.avatar_url,
        bio=user.bio,
        vip_level=user.vip_level,
        vip_expire_date=user.vip_expire_date,
        role=user.role,
        agency_id=user.agency_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# 乘客相关端点
@router.get("/passengers/", response_model=List[schemas.Passenger])
def read_passengers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    passengers = db.query(models.Passenger).offset(skip).limit(limit).all()
    return passengers

@router.get("/passengers/{passenger_id}", response_model=schemas.Passenger)
def read_passenger(passenger_id: int, db: Session = Depends(get_db)):
    db_passenger = db.query(models.Passenger).filter(models.Passenger.passenger_id == passenger_id).first()
    if db_passenger is None:
        raise HTTPException(status_code=404, detail="乘客不存在")
    return db_passenger

# 订单相关端点
@router.get("/orders/", response_model=List[schemas.Order])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    orders = db.query(models.Order).offset(skip).limit(limit).all()
    return orders

@router.get("/orders/{order_id}", response_model=schemas.Order)
def read_order(order_id: int, db: Session = Depends(get_db)):
    db_order = db.query(models.Order).filter(models.Order.order_id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="订单不存在")
    return db_order

# 认证端点
@router.post("/auth/login", response_model=schemas.Token)
def login_for_access_token(username: str, password: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# 用户相关端点
@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 检查用户名是否已存在
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="用户名已存在"
        )
    
    # 检查邮箱是否已存在
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="邮箱已存在"
        )
    
    # 创建新用户
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="用户不存在")
    return db_user

# 认证端点
@router.post("/auth/login", response_model=schemas.Token)
def login_for_access_token(username: str, password: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
