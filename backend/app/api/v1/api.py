from fastapi import APIRouter

# 仅注册已确认稳定的路由模块
from . import flights, orders, login, users

api_router = APIRouter()

# 航班相关路由
api_router.include_router(flights.router, prefix="/flights", tags=["flights"])

# 订单相关路由
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])

# 登录相关路由
api_router.include_router(login.router, prefix="/auth", tags=["login"])

# 用户相关路由
api_router.include_router(users.router, prefix="/users", tags=["users"])