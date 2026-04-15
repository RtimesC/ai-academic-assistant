from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PatientBase(BaseModel):
    name: str
    age: int
    gender: str
    phone: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    emergency_phone: Optional[str] = None
    dementia_stage: Optional[str] = None
    hypertension_level: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    emergency_phone: Optional[str] = None
    dementia_stage: Optional[str] = None
    hypertension_level: Optional[str] = None

class PatientResponse(PatientBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
