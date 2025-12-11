from pydantic import BaseModel
from pydantic import ConfigDict
from .airport import Airport


class RouteBase(BaseModel):
    departure_airport_code: str
    arrival_airport_code: str
    distance_km: int | None = None


class RouteCreate(RouteBase):
    pass


class RouteUpdate(RouteBase):
    pass


class Route(RouteBase):
    route_id: int
    model_config = ConfigDict(from_attributes=True)


class RouteWithAirports(Route):
    departure_airport: "Airport"
    arrival_airport: "Airport"


class RouteWithFlights(Route):
    flights: list = []
