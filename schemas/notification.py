from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NotificationCreate(BaseModel):
    title: str
    content: str
    target_user_id: Optional[int] = None


class NotificationResponse(BaseModel):
    notification_id: int
    title: str
    content: str
    target_user_id: Optional[int] = None
    created_at: Optional[datetime] = None
    created_by: int

    class Config:
        orm_mode = True


