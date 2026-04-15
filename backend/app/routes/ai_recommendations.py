from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.patient import Patient
from app.models.health_record import HealthRecord
from app.models.medication import Medication
from app.services.ai_service import AIService

router = APIRouter(prefix="/ai", tags=["ai-recommendations"])
ai_service = AIService()

@router.get("/risk-assessment/{patient_id}")
def get_risk_assessment(patient_id: int, db: Session = Depends(get_db)) -> Dict[str, Any]:
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    latest_record = db.query(HealthRecord).filter(
        HealthRecord.patient_id == patient_id
    ).order_by(HealthRecord.recorded_at.desc()).first()
    
    return ai_service.assess_risk(patient, latest_record)

@router.get("/medication-reminders/{patient_id}")
def get_medication_reminders(patient_id: int, db: Session = Depends(get_db)) -> Dict[str, Any]:
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    medications = db.query(Medication).filter(
        Medication.patient_id == patient_id,
        Medication.is_active == True
    ).all()
    
    return ai_service.generate_medication_reminders(patient, medications)

@router.get("/care-recommendations/{patient_id}")
def get_care_recommendations(patient_id: int, db: Session = Depends(get_db)) -> Dict[str, Any]:
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    records = db.query(HealthRecord).filter(
        HealthRecord.patient_id == patient_id
    ).order_by(HealthRecord.recorded_at.desc()).limit(10).all()
    
    medications = db.query(Medication).filter(
        Medication.patient_id == patient_id,
        Medication.is_active == True
    ).all()
    
    return ai_service.generate_care_recommendations(patient, records, medications)

@router.get("/alerts/{patient_id}")
def get_patient_alerts(patient_id: int, db: Session = Depends(get_db)) -> Dict[str, Any]:
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    latest_record = db.query(HealthRecord).filter(
        HealthRecord.patient_id == patient_id
    ).order_by(HealthRecord.recorded_at.desc()).first()
    
    return ai_service.generate_alerts(patient, latest_record)

@router.get("/dashboard-summary/{patient_id}")
def get_dashboard_summary(patient_id: int, db: Session = Depends(get_db)) -> Dict[str, Any]:
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    latest_record = db.query(HealthRecord).filter(
        HealthRecord.patient_id == patient_id
    ).order_by(HealthRecord.recorded_at.desc()).first()
    
    records = db.query(HealthRecord).filter(
        HealthRecord.patient_id == patient_id
    ).order_by(HealthRecord.recorded_at.desc()).limit(10).all()
    
    medications = db.query(Medication).filter(
        Medication.patient_id == patient_id,
        Medication.is_active == True
    ).all()
    
    risk = ai_service.assess_risk(patient, latest_record)
    alerts = ai_service.generate_alerts(patient, latest_record)
    recommendations = ai_service.generate_care_recommendations(patient, records, medications)
    
    return {
        "patient": {
            "id": patient.id,
            "name": patient.name,
            "age": patient.age,
            "dementia_stage": patient.dementia_stage,
            "hypertension_level": patient.hypertension_level,
        },
        "risk_assessment": risk,
        "alerts": alerts,
        "recommendations": recommendations,
        "active_medications_count": len(medications),
    }
