from typing import Optional
from pydantic import BaseModel


def mask_phone(phone: Optional[str]) -> Optional[str]:
    if not phone or len(phone) < 7:
        return phone
    return phone[:3] + "****" + phone[-4:]


def mask_id_card(id_card: Optional[str]) -> Optional[str]:
    if not id_card or len(id_card) < 8:
        return id_card
    return id_card[:4] + "********" + id_card[-4:]


class UserBase(BaseModel):
    id: int
    username: str
    role: str
    is_frozen: bool
    phone: Optional[str] = None
    id_card: Optional[str] = None

    class Config:
        orm_mode = True

    def model_dump(self, **kwargs):
        data = super().model_dump(**kwargs)
        data["phone"] = mask_phone(data.get("phone"))
        data["id_card"] = mask_id_card(data.get("id_card"))
        return data


class UserStateUpdate(BaseModel):
    is_frozen: bool


class UserResponse(UserBase):
    pass


