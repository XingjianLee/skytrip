from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def get_by_username(self, db: Session, *, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()

    def get_by_phone(self, db: Session, *, phone: str) -> Optional[User]:
        return db.query(User).filter(User.phone == phone).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            username=obj_in.username,
            email=obj_in.email,
            password=get_password_hash(obj_in.password),
            real_name=obj_in.real_name,
            id_card=obj_in.id_card,
            phone=obj_in.phone,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def authenticate(
        self, db: Session, *, username: str, password: str
    ) -> Optional[User]:
        user = self.get_by_username(db, username=username)
        if not user:
            return None
        stored = user.password or ""
        if stored.startswith("$2b$") or stored.startswith("$2a$") or stored.startswith("$2y$"):
            if not verify_password(password, stored):
                return None
        else:
            if password != stored:
                return None
        return user

    def update_profile(self, db: Session, *, db_obj: User, obj_in: UserUpdate) -> User:
        update_map = {}
        if obj_in.email is not None:
            update_map['email'] = obj_in.email
        if obj_in.phone is not None:
            update_map['phone'] = obj_in.phone
        if obj_in.real_name is not None:
            update_map['real_name'] = obj_in.real_name
        if obj_in.avatar_url is not None:
            update_map['avatar_url'] = obj_in.avatar_url
        if obj_in.bio is not None:
            update_map['bio'] = obj_in.bio
        if obj_in.vip_level is not None:
            update_map['vip_level'] = obj_in.vip_level
        if obj_in.vip_expire_date is not None:
            update_map['vip_expire_date'] = obj_in.vip_expire_date
        if obj_in.password is not None:
            update_map['password'] = get_password_hash(obj_in.password)
        for k, v in update_map.items():
            setattr(db_obj, k, v)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def is_active(self, user: User) -> bool:
        return user.is_active

    def is_superuser(self, user: User) -> bool:
        return user.is_superuser

user = CRUDUser(User)