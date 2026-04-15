from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CarePlanBase(BaseModel):
    patient_id: int
    title: str
    description: Optional[str] = None
    goals: Optional[str] = None
    interventions: Optional[str] = None
    status: str = "active"
    created_by: Optional[str] = None

class CarePlanCreate(CarePlanBase):
    pass

class CarePlanUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    goals: Optional[str] = None
    interventions: Optional[str] = None
    status: Optional[str] = None

class CarePlanResponse(CarePlanBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
