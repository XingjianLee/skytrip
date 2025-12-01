from typing import Optional
from pydantic import BaseModel


class ScenicSpotBase(BaseModel):
    name: str
    city: str
    address: Optional[str] = None
    description: Optional[str] = None
    open_time: Optional[str] = None
    close_time: Optional[str] = None
    ticket_price: Optional[float] = None
    status: Optional[str] = "active"


class ScenicSpotCreate(ScenicSpotBase):
    pass


class ScenicSpotUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    description: Optional[str] = None
    open_time: Optional[str] = None
    close_time: Optional[str] = None
    ticket_price: Optional[float] = None
    status: Optional[str] = None


class ScenicSpotResponse(ScenicSpotBase):
    spot_id: int

    class Config:
        orm_mode = True


