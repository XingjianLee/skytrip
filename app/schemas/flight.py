from datetime import time
from typing import Optional
from pydantic import BaseModel


class FlightBase(BaseModel):
    flight_number: str
    airline_code: str
    route_id: int
    aircraft_type: Optional[str] = None
    economy_seats: int
    business_seats: int
    first_seats: int
    operating_days: str
    status: str
    scheduled_departure_time: time
    scheduled_arrival_time: time


class FlightCreate(FlightBase):
    pass


class FlightUpdate(BaseModel):
    aircraft_type: Optional[str] = None
    economy_seats: Optional[int] = None
    business_seats: Optional[int] = None
    first_seats: Optional[int] = None
    operating_days: Optional[str] = None
    status: Optional[str] = None


class FlightResponse(FlightBase):
    flight_id: int

    class Config:
        orm_mode = True


