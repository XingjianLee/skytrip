from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import NotificationCreate, NotificationResponse

router = APIRouter()


@router.get("/", response_model=list[NotificationResponse])
def list_notifications(
    db: Session = Depends(deps.get_db_session), _: User = Depends(deps.get_current_admin)
):
    return db.query(Notification).all()


@router.post("/", response_model=NotificationResponse)
def send_notification(
    payload: NotificationCreate,
    db: Session = Depends(deps.get_db_session),
    current_admin: User = Depends(deps.get_current_admin),
):
    notification = Notification(
        **payload.dict(),
        created_at=datetime.utcnow(),
        created_by=current_admin.id,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: int,
    db: Session = Depends(deps.get_db_session),
    _: User = Depends(deps.get_current_admin),
):
    notification = (
        db.query(Notification).filter(Notification.notification_id == notification_id).first()
    )
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="通知不存在")
    db.delete(notification)
    db.commit()


