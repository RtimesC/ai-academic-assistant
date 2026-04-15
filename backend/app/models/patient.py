from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer)
    gender = Column(String)
    phone = Column(String)
    address = Column(String)
    emergency_contact = Column(String)
    emergency_phone = Column(String)
    dementia_stage = Column(String)  # mild, moderate, severe
    hypertension_level = Column(String)  # stage1, stage2, crisis
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    health_records = relationship("HealthRecord", back_populates="patient")
    medications = relationship("Medication", back_populates="patient")
    care_plans = relationship("CarePlan", back_populates="patient")
