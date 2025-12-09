from typing import Any, Optional, Dict

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app import dependencies as deps

router = APIRouter()

@router.post("/", response_model=schemas.User)
def create_user(
    *, 
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user.
    """
    user = crud.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = crud.user.get_by_username(db, username=user_in.username)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = crud.user.create(db, obj_in=user_in)
    return user


@router.get("/me", response_model=schemas.User)
def read_user_me(
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user


@router.put("/me", response_model=schemas.User)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
    user_in: schemas.UserUpdate,
) -> Any:
    allowed_fields = {"real_name", "phone", "email", "avatar_url", "bio"}
    update_data: Dict[str, Any] = {k: v for k, v in user_in.dict(exclude_unset=True).items() if k in allowed_fields}
    if "email" in update_data and update_data["email"]:
        existing = crud.user.get_by_email(db, email=update_data["email"])
        if existing and existing.id != current_user.id:
            raise HTTPException(status_code=409, detail="邮箱已被使用")
    if "phone" in update_data and update_data["phone"]:
        from sqlalchemy import or_
        q = db.query(models.User).filter(models.User.phone == update_data["phone"]).first()
        if q and q.id != current_user.id:
            raise HTTPException(status_code=409, detail="手机号已被使用")
    obj = crud.user.update(db, db_obj=current_user, obj_in=update_data)
    return obj
