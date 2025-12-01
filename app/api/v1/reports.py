from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api import deps
from app.models.order import Order
from app.models.user import User
from app.schemas.report import FinancialReportResponse

router = APIRouter()


@router.get("/financial", response_model=FinancialReportResponse)
def get_financial_report(
    start_date: date = Query(..., description="起始日期"),
    end_date: date = Query(..., description="结束日期"),
    db: Session = Depends(deps.get_db_session),
    _: User = Depends(deps.get_current_admin),
):
    if start_date > end_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="日期范围不合法")

    total_revenue = (
        db.query(func.coalesce(func.sum(Order.total_amount), 0))
        .filter(
            Order.status.in_(["paid", "completed"]),
            Order.created_at >= start_date,
            Order.created_at <= end_date,
        )
        .scalar()
    )
    total_refund = (
        db.query(func.coalesce(func.sum(Order.total_amount), 0))
        .filter(
            Order.payment_status == "refunded",
            Order.updated_at >= start_date,
            Order.updated_at <= end_date,
        )
        .scalar()
    )
    order_count = (
        db.query(func.count(Order.order_id))
        .filter(Order.created_at >= start_date, Order.created_at <= end_date)
        .scalar()
    )

    return FinancialReportResponse(
        start_date=start_date,
        end_date=end_date,
        total_revenue=Decimal(total_revenue),
        total_refund=Decimal(total_refund),
        net_income=Decimal(total_revenue) - Decimal(total_refund),
        order_count=order_count,
    )


