from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api import deps
from app.models.flight import Flight
from app.models.user import User
from app.schemas.flight import FlightCreate, FlightResponse, FlightUpdate

router = APIRouter()


@router.get("/", response_model=list[FlightResponse])
def list_flights(db: Session = Depends(deps.get_db_session)):
    return db.query(Flight).all()


@router.post("/", response_model=FlightResponse)
def create_flight(
    payload: FlightCreate,
    db: Session = Depends(deps.get_db_session),
    _: User = Depends(deps.get_current_admin),
):
    # 验证 airline_code 是否存在
    airline_exists = db.execute(
        text("SELECT COUNT(*) FROM airlines WHERE airline_code = :code"),
        {"code": payload.airline_code}
    ).scalar()
    
    if airline_exists == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"航空公司代码 '{payload.airline_code}' 不存在，请先添加航空公司"
        )
    
    # 验证 route_id 是否存在
    route_exists = db.execute(
        text("SELECT COUNT(*) FROM routes WHERE route_id = :route_id"),
        {"route_id": payload.route_id}
    ).scalar()
    
    if route_exists == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"航线 ID {payload.route_id} 不存在"
        )
    
    flight = Flight(**payload.dict())
    db.add(flight)
    db.commit()
    db.refresh(flight)
    return flight


@router.put("/{flight_id}", response_model=FlightResponse)
def update_flight(
    flight_id: int,
    payload: FlightUpdate,
    db: Session = Depends(deps.get_db_session),
    _: None = Depends(deps.get_current_admin),
):
    flight = db.query(Flight).filter(Flight.flight_id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="航班不存在")
    for key, value in payload.dict(exclude_unset=True).items():
        setattr(flight, key, value)
    db.commit()
    db.refresh(flight)
    return flight


@router.delete("/{flight_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_flight(
    flight_id: int,
    db: Session = Depends(deps.get_db_session),
    _: None = Depends(deps.get_current_admin),
):
    flight = db.query(Flight).filter(Flight.flight_id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="航班不存在")
    db.delete(flight)
    db.commit()


