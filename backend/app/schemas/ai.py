from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from pydantic import ConfigDict


class AIChatRequest(BaseModel):
    message: str


class AISuggestion(BaseModel):
    label: str
    route: Optional[str] = None
    params: Optional[Dict[str, Any]] = None


class AIOrderSummary(BaseModel):
    order_id: int
    order_no: str
    status: str
    payment_status: str
    total: float


class AIChatResponse(BaseModel):
    reply: str
    suggestions: Optional[List[AISuggestion]] = None
    orders: Optional[List[AIOrderSummary]] = None
    model_config = ConfigDict(from_attributes=True)

