from typing import List, Optional
from datetime import datetime, date
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, func
from app.crud.base import CRUDBase
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus, CheckInStatus, TicketStatus
from app.schemas.order import OrderCreate, OrderUpdate


class CRUDOrder(CRUDBase[Order, OrderCreate, OrderUpdate]):
    """订单CRUD操作"""
    def get(self, db: Session, id: int) -> Optional[Order]:
        """根据主键order_id获取订单"""
        return db.query(Order).filter(Order.order_id == id).first()
    
    def get_by_order_no(self, db: Session, *, order_no: str) -> Optional[Order]:
        """根据订单号获取订单"""
        return db.query(Order).filter(Order.order_no == order_no).first()
    
    def get_by_user(self, db: Session, *, user_id: int) -> List[Order]:
        """根据用户ID获取订单列表"""
        return db.query(Order).filter(Order.user_id == user_id).all()
    
    def get_by_status(self, db: Session, *, status: OrderStatus) -> List[Order]:
        """根据订单状态获取订单列表"""
        return db.query(Order).filter(Order.status == status).all()
    
    def get_by_payment_status(self, db: Session, *, payment_status: PaymentStatus) -> List[Order]:
        """根据支付状态获取订单列表"""
        return db.query(Order).filter(Order.payment_status == payment_status).all()
    
    def get_with_items(self, db: Session, order_id: int) -> Optional[Order]:
        """获取包含订单项的订单"""
        return db.query(Order).options(
            joinedload(Order.items).joinedload(OrderItem.passenger),
            joinedload(Order.items).joinedload(OrderItem.flight)
        ).filter(Order.order_id == order_id).first()
    
    def get_user_orders_with_items(
        self, 
        db: Session, 
        *, 
        user_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[Order]:
        """获取用户的订单列表（包含订单项）"""
        return db.query(Order).options(
            joinedload(Order.items).joinedload(OrderItem.passenger),
            joinedload(Order.items).joinedload(OrderItem.flight)
        ).filter(Order.user_id == user_id).offset(skip).limit(limit).all()
    
    def get_orders_by_date_range(
        self,
        db: Session,
        *,
        start_date: date,
        end_date: date,
        user_id: Optional[int] = None
    ) -> List[Order]:
        """根据日期范围获取订单"""
        query = db.query(Order).filter(
            func.date(Order.created_at) >= start_date,
            func.date(Order.created_at) <= end_date
        )
        
        if user_id:
            query = query.filter(Order.user_id == user_id)
        
        return query.all()
    
    def get_pending_payment_orders(self, db: Session) -> List[Order]:
        """获取待支付订单"""
        return db.query(Order).filter(
            Order.payment_status == PaymentStatus.UNPAID,
            Order.status == OrderStatus.PENDING
        ).all()
    
    def get_expired_orders(self, db: Session, *, expire_minutes: int = 30) -> List[Order]:
        """获取过期未支付订单"""
        from datetime import timedelta
        expire_time = datetime.utcnow() - timedelta(minutes=expire_minutes)
        
        return db.query(Order).filter(
            Order.payment_status == PaymentStatus.UNPAID,
            Order.status == OrderStatus.PENDING,
            Order.created_at < expire_time
        ).all()
    
    def update_payment_status(
        self,
        db: Session,
        *,
        order_id: int,
        payment_status: PaymentStatus,
        payment_time: Optional[datetime] = None
    ) -> Optional[Order]:
        """更新订单支付状态"""
        order = self.get(db, id=order_id)
        if order:
            order.payment_status = payment_status
            if payment_time:
                order.paid_at = payment_time
            if payment_status == PaymentStatus.PAID:
                order.status = OrderStatus.PAID
            db.add(order)
            db.commit()
            db.refresh(order)
        return order
    
    def cancel_order(self, db: Session, *, order_id: int) -> Optional[Order]:
        """取消订单"""
        order = self.get(db, id=order_id)
        if order and order.status in [OrderStatus.PENDING, OrderStatus.PAID]:
            order.status = OrderStatus.CANCELLED
            # 同时取消所有订单项
            for item in order.items:
                item.ticket_status = TicketStatus.CANCELLED
            db.add(order)
            db.commit()
            db.refresh(order)
        return order


class CRUDOrderItem(CRUDBase[OrderItem, dict, dict]):
    """订单项CRUD操作"""
    def get(self, db: Session, id: int) -> Optional[OrderItem]:
        """根据主键item_id获取订单项"""
        return db.query(OrderItem).filter(OrderItem.item_id == id).first()
    
    def get_by_order(self, db: Session, *, order_id: int) -> List[OrderItem]:
        """根据订单ID获取订单项列表"""
        return db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
    
    def get_by_passenger(self, db: Session, *, passenger_id: int) -> List[OrderItem]:
        """根据乘客ID获取订单项列表"""
        return db.query(OrderItem).filter(OrderItem.passenger_id == passenger_id).all()
    
    def get_by_flight(self, db: Session, *, flight_id: int) -> List[OrderItem]:
        """根据航班ID获取订单项列表"""
        return db.query(OrderItem).filter(OrderItem.flight_id == flight_id).all()
    
    def get_with_details(self, db: Session, item_id: int) -> Optional[OrderItem]:
        """获取包含详细信息的订单项"""
        return db.query(OrderItem).options(
            joinedload(OrderItem.order),
            joinedload(OrderItem.passenger),
            joinedload(OrderItem.flight)
        ).filter(OrderItem.item_id == item_id).first()
    
    def get_by_check_in_status(
        self, 
        db: Session, 
        *, 
        check_in_status: CheckInStatus
    ) -> List[OrderItem]:
        """根据值机状态获取订单项列表"""
        return db.query(OrderItem).filter(
            OrderItem.check_in_status == check_in_status
        ).all()
    
    def get_by_ticket_status(
        self, 
        db: Session, 
        *, 
        ticket_status: TicketStatus
    ) -> List[OrderItem]:
        """根据票务状态获取订单项列表"""
        return db.query(OrderItem).filter(
            OrderItem.ticket_status == ticket_status
        ).all()
    
    def update_check_in_status(
        self,
        db: Session,
        *,
        item_id: int,
        check_in_status: CheckInStatus,
        seat_number: Optional[str] = None
    ) -> Optional[OrderItem]:
        """更新值机状态"""
        item = self.get(db, id=item_id)
        if item:
            item.check_in_status = check_in_status
            if seat_number:
                item.seat_number = seat_number
            db.add(item)
            db.commit()
            db.refresh(item)
        return item
    
    def update_ticket_status(
        self,
        db: Session,
        *,
        item_id: int,
        ticket_status: TicketStatus
    ) -> Optional[OrderItem]:
        """更新票务状态"""
        item = self.get(db, id=item_id)
        if item:
            item.ticket_status = ticket_status
            db.add(item)
            db.commit()
            db.refresh(item)
        return item


order = CRUDOrder(Order)
order_item = CRUDOrderItem(OrderItem)