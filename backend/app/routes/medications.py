from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.medication import Medication
from app.schemas.medication import MedicationCreate, MedicationUpdate, MedicationResponse

router = APIRouter(prefix="/medications", tags=["medications"])

@router.get("/patient/{patient_id}", response_model=List[MedicationResponse])
def get_patient_medications(patient_id: int, active_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(Medication).filter(Medication.patient_id == patient_id)
    if active_only:
        query = query.filter(Medication.is_active == True)
    return query.all()

@router.post("/", response_model=MedicationResponse)
def create_medication(medication: MedicationCreate, db: Session = Depends(get_db)):
    db_med = Medication(**medication.model_dump())
    db.add(db_med)
    db.commit()
    db.refresh(db_med)
    return db_med

@router.put("/{medication_id}", response_model=MedicationResponse)
def update_medication(medication_id: int, update: MedicationUpdate, db: Session = Depends(get_db)):
    med = db.query(Medication).filter(Medication.id == medication_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medication not found")
    for key, value in update.model_dump(exclude_none=True).items():
        setattr(med, key, value)
    db.commit()
    db.refresh(med)
    return med

@router.delete("/{medication_id}")
def delete_medication(medication_id: int, db: Session = Depends(get_db)):
    med = db.query(Medication).filter(Medication.id == medication_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medication not found")
    db.delete(med)
    db.commit()
    return {"message": "Medication deleted successfully"}
