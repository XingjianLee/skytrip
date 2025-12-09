from fastapi import APIRouter

from app.api.v1 import admin, flights, hotels, scenic_spots, users, orders, notifications, reports

router = APIRouter()
router.include_router(admin.router, prefix="/admin", tags=["Admin"])
router.include_router(flights.router, prefix="/flights", tags=["Flights"])
router.include_router(hotels.router, prefix="/hotels", tags=["Hotels"])
router.include_router(scenic_spots.router, prefix="/scenic-spots", tags=["Scenic Spots"])
router.include_router(users.router, prefix="/users", tags=["Users"])
router.include_router(orders.router, prefix="/orders", tags=["Orders"])
router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
router.include_router(reports.router, prefix="/reports", tags=["Reports"])


