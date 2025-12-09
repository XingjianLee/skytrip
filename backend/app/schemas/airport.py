from pydantic import BaseModel
from pydantic import ConfigDict


class AirportBase(BaseModel):
    airport_code: str
    airport_name: str
    city: str
    country: str


class AirportCreate(AirportBase):
    pass


class AirportUpdate(AirportBase):
    pass


class Airport(AirportBase):
    model_config = ConfigDict(from_attributes=True)


class AirportWithRoutes(Airport):
    routes: list = []
