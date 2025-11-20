from pydantic import BaseModel


class AirlineBase(BaseModel):
    name: str
    iata_code: str


class AirlineCreate(AirlineBase):
    pass


class AirlineUpdate(AirlineBase):
    pass


class Airline(AirlineBase):
    id: int

    class Config:
        orm_mode = True


class AirlineWithFlights(Airline):
    flights: list = []