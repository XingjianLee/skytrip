from pydantic import BaseModel
from pydantic import ConfigDict


class AirlineBase(BaseModel):
    airline_code: str
    airline_name: str
    country: str


class AirlineCreate(AirlineBase):
    pass


class AirlineUpdate(AirlineBase):
    pass


class Airline(AirlineBase):
    model_config = ConfigDict(from_attributes=True)


class AirlineWithFlights(Airline):
    flights: list = []
