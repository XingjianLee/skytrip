from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.schemas.user import UserResponse, UserStateUpdate

router = APIRouter()


@router.get("/", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(deps.get_db_session), _: User = Depends(deps.get_current_admin)
):
    return db.query(User).all()


@router.patch("/{user_id}/state", response_model=UserResponse)
def update_user_state(
    user_id: int,
    payload: UserStateUpdate,
    db: Session = Depends(deps.get_db_session),
    _: User = Depends(deps.get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")
    user.is_frozen = payload.is_frozen
    db.commit()
    db.refresh(user)
    return user


