from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class HealthRecordBase(BaseModel):
    patient_id: int
    systolic_bp: Optional[float] = None
    diastolic_bp: Optional[float] = None
    heart_rate: Optional[float] = None
    blood_glucose: Optional[float] = None
    weight: Optional[float] = None
    temperature: Optional[float] = None
    mmse_score: Optional[float] = None
    notes: Optional[str] = None

class HealthRecordCreate(HealthRecordBase):
    pass

class HealthRecordResponse(HealthRecordBase):
    id: int
    recorded_at: datetime

    class Config:
        from_attributes = True
