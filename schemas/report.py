from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel


class FinancialReportResponse(BaseModel):
    start_date: date
    end_date: date
    total_revenue: Decimal
    total_refund: Decimal
    net_income: Decimal
    order_count: int
    paid_orders: int
    cancelled_orders: int
    avg_order_value: Decimal


class DailySalesTrend(BaseModel):
    date: date
    revenue: Decimal
    order_count: int
    user_count: int


class SalesTrendResponse(BaseModel):
    start_date: date
    end_date: date
    trend_data: List[DailySalesTrend]
    total_revenue: Decimal
    avg_daily_revenue: Decimal


class UserGrowthResponse(BaseModel):
    start_date: date
    end_date: date
    new_users: int
    active_users: int
    user_growth_rate: float
    user_level_distribution: dict


class PopularFlightItem(BaseModel):
    flight_id: int
    flight_number: str
    airline_code: str
    sales_count: int
    revenue: Decimal
    avg_occupancy_rate: Optional[float] = None


class PopularFlightResponse(BaseModel):
    start_date: date
    end_date: date
    flights: List[PopularFlightItem]


class DashboardSummaryResponse(BaseModel):
    today_revenue: Decimal
    week_revenue: Decimal
    month_revenue: Decimal
    total_orders_today: int
    total_orders_week: int
    total_orders_month: int
    active_users: int
    new_users_today: int
    top_flights: List[dict]
    recent_orders: List[dict]


