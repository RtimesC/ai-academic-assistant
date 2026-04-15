from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.health_record import HealthRecord
from app.schemas.health_record import HealthRecordCreate, HealthRecordResponse

router = APIRouter(prefix="/health-records", tags=["health-records"])

@router.get("/patient/{patient_id}", response_model=List[HealthRecordResponse])
def get_patient_records(patient_id: int, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(HealthRecord).filter(
        HealthRecord.patient_id == patient_id
    ).order_by(HealthRecord.recorded_at.desc()).offset(skip).limit(limit).all()

@router.post("/", response_model=HealthRecordResponse)
def create_health_record(record: HealthRecordCreate, db: Session = Depends(get_db)):
    db_record = HealthRecord(**record.model_dump())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@router.get("/{record_id}", response_model=HealthRecordResponse)
def get_health_record(record_id: int, db: Session = Depends(get_db)):
    record = db.query(HealthRecord).filter(HealthRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Health record not found")
    return record
