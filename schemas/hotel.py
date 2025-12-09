from typing import Optional
from pydantic import BaseModel


class HotelBase(BaseModel):
    name: str
    city: str
    address: Optional[str] = None
    star_rating: Optional[int] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = "active"
    lowest_price: Optional[float] = None


class HotelCreate(HotelBase):
    pass


class HotelUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    star_rating: Optional[int] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None
    lowest_price: Optional[float] = None


class HotelResponse(HotelBase):
    hotel_id: int

    class Config:
        orm_mode = True


