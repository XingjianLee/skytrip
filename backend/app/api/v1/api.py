from fastapi import APIRouter

# Import sub-routers
from .flights import router as flights_router
from .orders import router as orders_router
from .check_in import router as check_in_router


api_router = APIRouter()

# Mount routers with prefixes
api_router.include_router(flights_router, prefix="/flights", tags=["flights"])
api_router.include_router(orders_router, prefix="/orders", tags=["orders"])
api_router.include_router(check_in_router, prefix="/check-in", tags=["check-in"])