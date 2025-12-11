from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.flight_pricing import FlightPricing
from app.schemas.flight import FlightPricingCreate, FlightPricingUpdate


class CRUDFlightPricing(CRUDBase[FlightPricing, FlightPricingCreate, FlightPricingUpdate]):
    def get_by_flight(self, db: Session, *, flight_id: int) -> List[FlightPricing]:
        return db.query(FlightPricing).filter(FlightPricing.flight_id == flight_id).all()


flight_pricing = CRUDFlightPricing(FlightPricing)
