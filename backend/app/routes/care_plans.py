from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.care_plan import CarePlan
from app.schemas.care_plan import CarePlanCreate, CarePlanUpdate, CarePlanResponse

router = APIRouter(prefix="/care-plans", tags=["care-plans"])

@router.get("/patient/{patient_id}", response_model=List[CarePlanResponse])
def get_patient_care_plans(patient_id: int, db: Session = Depends(get_db)):
    return db.query(CarePlan).filter(CarePlan.patient_id == patient_id).all()

@router.post("/", response_model=CarePlanResponse)
def create_care_plan(plan: CarePlanCreate, db: Session = Depends(get_db)):
    db_plan = CarePlan(**plan.model_dump())
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

@router.put("/{plan_id}", response_model=CarePlanResponse)
def update_care_plan(plan_id: int, update: CarePlanUpdate, db: Session = Depends(get_db)):
    plan = db.query(CarePlan).filter(CarePlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Care plan not found")
    for key, value in update.model_dump(exclude_none=True).items():
        setattr(plan, key, value)
    db.commit()
    db.refresh(plan)
    return plan
