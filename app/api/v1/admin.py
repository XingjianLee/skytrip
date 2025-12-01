from typing import List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc, extract
from datetime import datetime, date, timedelta
from decimal import Decimal

from app.api import deps
from app.core.security import create_access_token, verify_password, get_password_hash
from app.models.user import User
from app.models.flight import Flight
from app.models.order import Order
from app.models.order_item import OrderItem
from app.schemas import auth as auth_schema
from app.schemas.user import UserResponse, UserStateUpdate
from app.schemas.flight import FlightCreate, FlightUpdate, FlightResponse
from app.schemas.order import (
    OrderResponse, OrderDetailResponse, OrderListResponse, 
    OrderUpdate, OrderRefundRequest
)
from app.schemas.report import (
    FinancialReportResponse, SalesTrendResponse, UserGrowthResponse,
    PopularFlightResponse, DashboardSummaryResponse, DailySalesTrend
)

router = APIRouter()


@router.post("/login", response_model=auth_schema.Token)
def admin_login(payload: auth_schema.LoginRequest, db: Session = Depends(deps.get_db_session)):
    user: Optional[User] = db.query(User).filter(User.username == payload.username).first()
    if not user or not user.is_admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="账号不存在或无权限")
    if not verify_password(payload.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="密码错误")
    token = create_access_token(user.username)
    return auth_schema.Token(access_token=token)


@router.post("/register", response_model=auth_schema.Token)
def user_register(payload: auth_schema.RegisterRequest, db: Session = Depends(deps.get_db_session)):
    # 检查用户名是否已存在
    existing_user = db.query(User).filter(User.username == payload.username).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="用户名已存在")
    
    # 检查身份证号是否已存在
    existing_id_card = db.query(User).filter(User.id_card == payload.id_card).first()
    if existing_id_card:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="身份证号已被使用")
    
    # 创建新用户
    hashed_password = get_password_hash(payload.password)
    new_user = User(
        username=payload.username,
        password=hashed_password,
        email=payload.email,
        phone=payload.phone,
        real_name=payload.real_name,
        id_card=payload.id_card,
        role="admin",  # 注册为管理员用户以符合登录要求
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        is_frozen=False
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # 生成访问令牌
    token = create_access_token(new_user.username)
    return auth_schema.Token(access_token=token)


@router.get("/users", response_model=List[UserResponse])
def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    role: Optional[str] = None,
    is_frozen: Optional[bool] = None,
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """获取用户列表，支持分页和筛选"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    query = db.query(User)
    
    # 应用筛选条件
    if role:
        query = query.filter(User.role == role)
    if is_frozen is not None:
        query = query.filter(User.is_frozen == is_frozen)
    
    # 分页
    users = query.offset(skip).limit(limit).all()
    return users


@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """获取用户详情"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")
    
    return user


@router.patch("/users/{user_id}/state")
def update_user_state(
    user_id: int,
    payload: UserStateUpdate,
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """更新用户状态（冻结/解冻）"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")
    
    # 不允许冻结自己
    if user.id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="不能冻结自己的账户")
    
    user.is_frozen = payload.is_frozen
    user.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "用户状态更新成功", "is_frozen": user.is_frozen}


class UserUpdate(BaseModel):
    """用户信息更新模型"""
    role: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    real_name: Optional[str] = None
    bio: Optional[str] = None
    vip_level: Optional[int] = None
    vip_expire_date: Optional[datetime] = None
    
    class Config:
        from_attributes = True


@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """编辑用户信息"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")
    
    # 更新用户信息
    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    
    return {"message": "用户信息更新成功", "user": user}


# 航班管理API
@router.get("/flights", response_model=List[FlightResponse])
def get_flights(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    airline_code: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """获取航班列表，支持分页和筛选"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    query = db.query(Flight)
    
    # 应用筛选条件
    if airline_code:
        query = query.filter(Flight.airline_code == airline_code)
    if status:
        query = query.filter(Flight.status == status)
    
    # 分页
    flights = query.offset(skip).limit(limit).all()
    return flights


@router.get("/flights/{flight_id}", response_model=FlightResponse)
def get_flight(
    flight_id: int,
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """获取航班详情"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    flight = db.query(Flight).filter(Flight.flight_id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="航班不存在")
    
    return flight


@router.post("/flights", response_model=FlightResponse)
def create_flight(
    payload: FlightCreate,
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """创建新航班"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    # 检查航班号是否已存在
    existing_flight = db.query(Flight).filter(Flight.flight_number == payload.flight_number).first()
    if existing_flight:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="航班号已存在")
    
    # 创建新航班
    new_flight = Flight(**payload.dict())
    db.add(new_flight)
    db.commit()
    db.refresh(new_flight)
    
    return new_flight


@router.put("/flights/{flight_id}", response_model=FlightResponse)
def update_flight(
    flight_id: int,
    payload: FlightUpdate,
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """更新航班信息"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    flight = db.query(Flight).filter(Flight.flight_id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="航班不存在")
    
    # 更新航班信息
    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(flight, field, value)
    
    db.commit()
    db.refresh(flight)
    
    return flight


@router.patch("/flights/{flight_id}/status")
def update_flight_status(
    flight_id: int,
    status: str,
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """更新航班状态（激活/暂停）"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    # 验证状态值
    if status not in ["active", "suspended"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="无效的状态值")
    
    flight = db.query(Flight).filter(Flight.flight_id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="航班不存在")
    
    flight.status = status
    db.commit()
    
    return {"message": "航班状态更新成功", "status": flight.status}


# 订单管理API
@router.get("/orders", response_model=OrderListResponse)
def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    order_no: Optional[str] = None,
    status: Optional[str] = None,
    payment_status: Optional[str] = None,
    user_id: Optional[int] = None,
    username: Optional[str] = None,
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """获取订单列表，支持分页和多条件筛选"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    # 构建查询
    query = db.query(Order).join(User)
    
    # 应用筛选条件
    if order_no:
        query = query.filter(Order.order_no.like(f"%{order_no}%"))
    if status:
        query = query.filter(Order.status == status)
    if payment_status:
        query = query.filter(Order.payment_status == payment_status)
    if user_id:
        query = query.filter(Order.user_id == user_id)
    if username:
        query = query.filter(User.username.like(f"%{username}%"))
    
    # 计算总数
    total = query.count()
    
    # 分页并获取数据
    orders = query.offset(skip).limit(limit).all()
    
    # 构建响应
    return OrderListResponse(
        total=total,
        page=skip // limit + 1,
        page_size=limit,
        total_pages=(total + limit - 1) // limit,
        items=orders
    )


@router.get("/orders/{order_id}", response_model=OrderDetailResponse)
def get_order_detail(
    order_id: int,
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """获取订单详情"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    # 查询订单及相关信息
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在")
    
    # 加载订单项目
    items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
    
    # 构建响应数据
    order_data = {
        "order_id": order.order_id,
        "order_no": order.order_no,
        "user_id": order.user_id,
        "username": order.user.username if order.user else None,
        "user_email": order.user.email if order.user else None,
        "total_amount": order.total_amount,
        "total_amount_original": order.total_amount_original,
        "currency": order.currency,
        "payment_method": order.payment_method,
        "payment_status": order.payment_status,
        "status": order.status,
        "created_at": order.created_at,
        "paid_at": order.paid_at,
        "expired_at": order.expired_at,
        "updated_at": order.updated_at,
        "items": items
    }
    
    return order_data


@router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    payload: OrderUpdate,
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """更新订单状态和支付状态"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在")
    
    # 更新状态
    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(order, field, value)
    
    # 如果更新为已支付状态，设置支付时间
    if "payment_status" in update_data and update_data["payment_status"] == "paid" and not order.paid_at:
        order.paid_at = datetime.utcnow()
        order.status = "paid"  # 同时更新订单状态
    
    order.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(order)
    
    return {"message": "订单状态更新成功", "order": order}


@router.post("/orders/{order_id}/refund")
def process_refund(
    order_id: int,
    payload: OrderRefundRequest,
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """处理订单退款"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在")
    
    # 检查订单状态是否可退款
    if order.payment_status != "paid":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="只有已支付的订单才能退款")
    
    # 设置退款金额
    refund_amount = payload.refund_amount if payload.refund_amount else order.total_amount
    
    # 更新订单状态
    order.payment_status = "refunded"
    order.status = "cancelled"
    order.updated_at = datetime.utcnow()
    
    # 记录退款信息（这里简化处理，实际应该有专门的退款记录表）
    refund_info = {
        "order_id": order_id,
        "refund_amount": refund_amount,
        "reason": payload.reason or "管理员手动退款",
        "refund_method": payload.refund_method,
        "processed_by": current_user.username,
        "processed_at": datetime.utcnow()
    }
    
    db.commit()
    
    return {
        "message": "退款处理成功",
        "refund_info": refund_info,
        "order_no": order.order_no
    }


@router.get("/dashboard/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """获取管理仪表盘概览数据"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    # 获取日期范围
    today = date.today()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    # 今日收入
    today_orders = db.query(func.sum(Order.total_amount)).filter(
        func.date(Order.created_at) == today,
        Order.payment_status == "paid"
    ).scalar() or Decimal('0')
    
    # 本周收入
    week_orders = db.query(func.sum(Order.total_amount)).filter(
        Order.created_at >= week_ago,
        Order.payment_status == "paid"
    ).scalar() or Decimal('0')
    
    # 本月收入
    month_orders = db.query(func.sum(Order.total_amount)).filter(
        Order.created_at >= month_ago,
        Order.payment_status == "paid"
    ).scalar() or Decimal('0')
    
    # 订单数量统计
    total_orders_today = db.query(func.count(Order.order_id)).filter(
        func.date(Order.created_at) == today
    ).scalar() or 0
    
    total_orders_week = db.query(func.count(Order.order_id)).filter(
        Order.created_at >= week_ago
    ).scalar() or 0
    
    total_orders_month = db.query(func.count(Order.order_id)).filter(
        Order.created_at >= month_ago
    ).scalar() or 0
    
    # 活跃用户数（过去30天有订单的用户）
    active_users = db.query(func.count(func.distinct(Order.user_id))).filter(
        Order.created_at >= month_ago
    ).scalar() or 0
    
    # 今日新用户
    new_users_today = db.query(func.count(User.user_id)).filter(
        func.date(User.created_at) == today
    ).scalar() or 0
    
    # 热门航班（按销售数量排序）
    top_flights = db.query(
        Flight.flight_id,
        Flight.flight_number,
        Flight.airline_code,
        func.count(OrderItem.item_id).label('sales_count')
    ).join(
        OrderItem, Flight.flight_id == OrderItem.flight_id
    ).join(
        Order, OrderItem.order_id == Order.order_id
    ).filter(
        Order.created_at >= week_ago,
        Order.payment_status == "paid"
    ).group_by(
        Flight.flight_id, Flight.flight_number, Flight.airline_code
    ).order_by(
        desc('sales_count')
    ).limit(5).all()
    
    top_flights_list = [
        {
            "flight_id": flight.flight_id,
            "flight_number": flight.flight_number,
            "airline_code": flight.airline_code,
            "sales_count": flight.sales_count
        }
        for flight in top_flights
    ]
    
    # 最近订单
    recent_orders = db.query(
        Order.order_id,
        Order.order_no,
        Order.total_amount,
        Order.status,
        Order.payment_status,
        Order.created_at
    ).order_by(
        desc(Order.created_at)
    ).limit(5).all()
    
    recent_orders_list = [
        {
            "order_id": order.order_id,
            "order_no": order.order_no,
            "total_amount": float(order.total_amount),
            "status": order.status,
            "payment_status": order.payment_status,
            "created_at": order.created_at.isoformat()
        }
        for order in recent_orders
    ]
    
    return DashboardSummaryResponse(
        today_revenue=today_orders,
        week_revenue=week_orders,
        month_revenue=month_orders,
        total_orders_today=total_orders_today,
        total_orders_week=total_orders_week,
        total_orders_month=total_orders_month,
        active_users=active_users,
        new_users_today=new_users_today,
        top_flights=top_flights_list,
        recent_orders=recent_orders_list
    )


@router.get("/reports/financial", response_model=FinancialReportResponse)
def get_financial_report(
    start_date: date = Query(..., description="开始日期"),
    end_date: date = Query(..., description="结束日期"),
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """获取财务报表"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    # 计算总收入
    total_revenue = db.query(func.sum(Order.total_amount)).filter(
        Order.created_at >= start_date,
        Order.created_at <= end_date,
        Order.payment_status == "paid"
    ).scalar() or Decimal('0')
    
    # 计算总退款
    total_refund = db.query(func.sum(Order.total_amount)).filter(
        Order.created_at >= start_date,
        Order.created_at <= end_date,
        Order.payment_status == "refunded"
    ).scalar() or Decimal('0')
    
    # 计算净收入
    net_income = total_revenue - total_refund
    
    # 订单总数
    order_count = db.query(func.count(Order.order_id)).filter(
        Order.created_at >= start_date,
        Order.created_at <= end_date
    ).scalar() or 0
    
    # 已支付订单数
    paid_orders = db.query(func.count(Order.order_id)).filter(
        Order.created_at >= start_date,
        Order.created_at <= end_date,
        Order.payment_status == "paid"
    ).scalar() or 0
    
    # 已取消订单数
    cancelled_orders = db.query(func.count(Order.order_id)).filter(
        Order.created_at >= start_date,
        Order.created_at <= end_date,
        Order.status == "cancelled"
    ).scalar() or 0
    
    # 平均订单金额
    avg_order_value = db.query(func.avg(Order.total_amount)).filter(
        Order.created_at >= start_date,
        Order.created_at <= end_date,
        Order.payment_status == "paid"
    ).scalar() or Decimal('0')
    
    return FinancialReportResponse(
        start_date=start_date,
        end_date=end_date,
        total_revenue=total_revenue,
        total_refund=total_refund,
        net_income=net_income,
        order_count=order_count,
        paid_orders=paid_orders,
        cancelled_orders=cancelled_orders,
        avg_order_value=avg_order_value
    )


@router.get("/reports/sales-trend", response_model=SalesTrendResponse)
def get_sales_trend(
    start_date: date = Query(..., description="开始日期"),
    end_date: date = Query(..., description="结束日期"),
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """获取销售趋势报表"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    # 生成日期范围内的每日销售数据
    trend_data = []
    current_date = start_date
    total_revenue = Decimal('0')
    
    while current_date <= end_date:
        # 当日收入
        daily_revenue = db.query(func.sum(Order.total_amount)).filter(
            func.date(Order.created_at) == current_date,
            Order.payment_status == "paid"
        ).scalar() or Decimal('0')
        
        # 当日订单数
        daily_orders = db.query(func.count(Order.order_id)).filter(
            func.date(Order.created_at) == current_date
        ).scalar() or 0
        
        # 当日活跃用户数
        daily_users = db.query(func.count(func.distinct(Order.user_id))).filter(
            func.date(Order.created_at) == current_date
        ).scalar() or 0
        
        trend_data.append(DailySalesTrend(
            date=current_date,
            revenue=daily_revenue,
            order_count=daily_orders,
            user_count=daily_users
        ))
        
        total_revenue += daily_revenue
        current_date += timedelta(days=1)
    
    # 计算平均日收入
    days_count = (end_date - start_date).days + 1
    avg_daily_revenue = total_revenue / days_count if days_count > 0 else Decimal('0')
    
    return SalesTrendResponse(
        start_date=start_date,
        end_date=end_date,
        trend_data=trend_data,
        total_revenue=total_revenue,
        avg_daily_revenue=avg_daily_revenue
    )


@router.get("/reports/user-growth", response_model=UserGrowthResponse)
def get_user_growth(
    start_date: date = Query(..., description="开始日期"),
    end_date: date = Query(..., description="结束日期"),
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """获取用户增长报表"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    # 新增用户数
    new_users = db.query(func.count(User.user_id)).filter(
        User.created_at >= start_date,
        User.created_at <= end_date
    ).scalar() or 0
    
    # 活跃用户数（有订单的用户）
    active_users = db.query(func.count(func.distinct(Order.user_id))).filter(
        Order.created_at >= start_date,
        Order.created_at <= end_date
    ).scalar() or 0
    
    # 计算用户增长率
    # 计算开始日期前的用户总数作为基准
    previous_users = db.query(func.count(User.user_id)).filter(
        User.created_at < start_date
    ).scalar() or 1  # 避免除零错误
    
    user_growth_rate = (new_users / previous_users) * 100 if previous_users > 0 else 0
    
    # 用户等级分布（这里简化处理，假设用户表有level字段）
    # 由于之前看到的User模型没有level字段，这里返回空字典
    user_level_distribution = {}
    
    # 尝试获取用户角色分布作为替代
    role_distribution = db.query(
        User.role,
        func.count(User.user_id).label('count')
    ).filter(
        User.created_at >= start_date,
        User.created_at <= end_date
    ).group_by(
        User.role
    ).all()
    
    for role, count in role_distribution:
        user_level_distribution[role] = count
    
    return UserGrowthResponse(
        start_date=start_date,
        end_date=end_date,
        new_users=new_users,
        active_users=active_users,
        user_growth_rate=user_growth_rate,
        user_level_distribution=user_level_distribution
    )


@router.get("/reports/popular-flights", response_model=PopularFlightResponse)
def get_popular_flights(
    start_date: date = Query(..., description="开始日期"),
    end_date: date = Query(..., description="结束日期"),
    limit: int = Query(10, description="返回数量限制"),
    db: Session = Depends(deps.get_db_session),
    current_user: User = Depends(deps.get_current_admin)
):
    """获取热门航班报表"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    
    # 查询热门航班
    popular_flights = db.query(
        Flight.flight_id,
        Flight.flight_number,
        Flight.airline_code,
        func.count(OrderItem.item_id).label('sales_count'),
        func.sum(Order.total_amount).label('revenue')
    ).join(
        OrderItem, Flight.flight_id == OrderItem.flight_id
    ).join(
        Order, OrderItem.order_id == Order.order_id
    ).filter(
        Order.created_at >= start_date,
        Order.created_at <= end_date,
        Order.payment_status == "paid"
    ).group_by(
        Flight.flight_id, Flight.flight_number, Flight.airline_code
    ).order_by(
        desc('sales_count')
    ).limit(limit).all()
    
    # 转换为响应模型
    flights = []
    for flight in popular_flights:
        # 计算平均客座率（简化处理，假设Flight模型有capacity字段）
        # 由于之前看到的Flight模型没有capacity字段，这里返回None
        avg_occupancy_rate = None
        
        flights.append({
            "flight_id": flight.flight_id,
            "flight_number": flight.flight_number,
            "airline_code": flight.airline_code,
            "sales_count": flight.sales_count,
            "revenue": flight.revenue or Decimal('0'),
            "avg_occupancy_rate": avg_occupancy_rate
        })
    
    return PopularFlightResponse(
        start_date=start_date,
        end_date=end_date,
        flights=flights
    )


