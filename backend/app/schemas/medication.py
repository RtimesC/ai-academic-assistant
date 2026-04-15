from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MedicationBase(BaseModel):
    patient_id: int
    name: str
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    purpose: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: bool = True
    notes: Optional[str] = None

class MedicationCreate(MedicationBase):
    pass

class MedicationUpdate(BaseModel):
    name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    purpose: Optional[str] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = None
    notes: Optional[str] = None

class MedicationResponse(MedicationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
