from typing import Any

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
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Update current user profile. All fields are optional.
    """
    # uniqueness checks
    if user_in.email and user_in.email != current_user.email:
        existing = crud.user.get_by_email(db, email=user_in.email)
        if existing and existing.id != current_user.id:
            raise HTTPException(status_code=400, detail="邮箱已被使用")
    if user_in.phone and user_in.phone != current_user.phone:
        existing = crud.user.get_by_phone(db, phone=user_in.phone)
        if existing and existing.id != current_user.id:
            raise HTTPException(status_code=400, detail="手机号已被使用")

    updated = crud.user.update_profile(db, db_obj=current_user, obj_in=user_in)
    return updated