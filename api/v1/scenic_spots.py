from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.scenic_spot import ScenicSpot
from app.models.user import User
from app.schemas.scenic_spot import ScenicSpotCreate, ScenicSpotResponse, ScenicSpotUpdate

router = APIRouter()


@router.get("/", response_model=list[ScenicSpotResponse])
def list_spots(db: Session = Depends(deps.get_db_session)):
    return db.query(ScenicSpot).all()


@router.post("/", response_model=ScenicSpotResponse)
def create_spot(
    payload: ScenicSpotCreate,
    db: Session = Depends(deps.get_db_session),
    _: User = Depends(deps.get_current_admin),
):
    spot = ScenicSpot(**payload.dict())
    db.add(spot)
    db.commit()
    db.refresh(spot)
    return spot


@router.put("/{spot_id}", response_model=ScenicSpotResponse)
def update_spot(
    spot_id: int,
    payload: ScenicSpotUpdate,
    db: Session = Depends(deps.get_db_session),
    _: User = Depends(deps.get_current_admin),
):
    spot = db.query(ScenicSpot).filter(ScenicSpot.spot_id == spot_id).first()
    if not spot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="景点不存在")
    for key, value in payload.dict(exclude_unset=True).items():
        setattr(spot, key, value)
    db.commit()
    db.refresh(spot)
    return spot


@router.delete("/{spot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_spot(
    spot_id: int,
    db: Session = Depends(deps.get_db_session),
    _: User = Depends(deps.get_current_admin),
):
    spot = db.query(ScenicSpot).filter(ScenicSpot.spot_id == spot_id).first()
    if not spot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="景点不存在")
    db.delete(spot)
    db.commit()


