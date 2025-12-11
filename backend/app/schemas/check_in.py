from pydantic import BaseModel
from datetime import datetime


class CheckInBase(BaseModel):
    order_item_id: int
    seat_number: str | None = None
    check_in_time: datetime | None = None


class CheckInCreate(CheckInBase):
    pass


class CheckInUpdate(CheckInBase):
    pass


class CheckIn(CheckInBase):
    id: int

    class Config:
        orm_mode = True


class CheckInWithDetails(CheckIn):
    order_item: "OrderItem"


class SeatSelection(BaseModel):
    seat_number: str


class BoardingPass(BaseModel):
    passenger_name: str
    flight_number: str
    departure_time: datetime
    arrival_time: datetime
    origin: str
    destination: str
    seat_number: str
    boarding_time: datetime


class CheckInResponse(BaseModel):
    message: str
    boarding_pass: BoardingPass | None = None