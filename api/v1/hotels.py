from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.hotel import Hotel
from app.models.user import User
from app.schemas.hotel import HotelCreate, HotelResponse, HotelUpdate

router = APIRouter()


@router.get("/", response_model=list[HotelResponse])
def list_hotels(db: Session = Depends(deps.get_db_session)):
    return db.query(Hotel).all()


@router.post("/", response_model=HotelResponse)
def create_hotel(
    payload: HotelCreate,
    db: Session = Depends(deps.get_db_session),
    _: User = Depends(deps.get_current_admin),
):
    hotel = Hotel(**payload.dict())
    db.add(hotel)
    db.commit()
    db.refresh(hotel)
    return hotel


@router.put("/{hotel_id}", response_model=HotelResponse)
def update_hotel(
    hotel_id: int,
    payload: HotelUpdate,
    db: Session = Depends(deps.get_db_session),
    _: User = Depends(deps.get_current_admin),
):
    hotel = db.query(Hotel).filter(Hotel.hotel_id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="酒店不存在")
    for key, value in payload.dict(exclude_unset=True).items():
        setattr(hotel, key, value)
    db.commit()
    db.refresh(hotel)
    return hotel


@router.delete("/{hotel_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hotel(
    hotel_id: int,
    db: Session = Depends(deps.get_db_session),
    _: User = Depends(deps.get_current_admin),
):
    hotel = db.query(Hotel).filter(Hotel.hotel_id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="酒店不存在")
    db.delete(hotel)
    db.commit()


