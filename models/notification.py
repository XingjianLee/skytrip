from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(120), nullable=False)
    content = Column(Text, nullable=False)
    target_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_read = Column(Boolean, default=False)

    creator = relationship("User", foreign_keys=[created_by])
    target_user = relationship("User", foreign_keys=[target_user_id])


