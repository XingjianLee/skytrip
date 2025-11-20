from pydantic import BaseModel
from .airport import Airport


class RouteBase(BaseModel):
    origin_airport_id: int
    destination_airport_id: int


class RouteCreate(RouteBase):
    pass


class RouteUpdate(RouteBase):
    pass


class Route(RouteBase):
    id: int

    class Config:
        orm_mode = True


class RouteWithAirports(Route):
    origin_airport: "Airport"
    destination_airport: "Airport"


class RouteWithFlights(Route):
    flights: list = []

RouteWithAirports.model_rebuild()