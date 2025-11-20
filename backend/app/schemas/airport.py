from pydantic import BaseModel


class AirportBase(BaseModel):
    name: str
    iata_code: str
    city: str
    country: str


class AirportCreate(AirportBase):
    pass


class AirportUpdate(AirportBase):
    pass


class Airport(AirportBase):
    id: int

    class Config:
        orm_mode = True


class AirportWithRoutes(Airport):
    routes: list = []