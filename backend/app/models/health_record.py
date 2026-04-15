from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class HealthRecord(Base):
    __tablename__ = "health_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    systolic_bp = Column(Float)   # mmHg
    diastolic_bp = Column(Float)  # mmHg
    heart_rate = Column(Float)    # bpm
    blood_glucose = Column(Float) # mg/dL
    weight = Column(Float)        # kg
    temperature = Column(Float)   # Celsius
    mmse_score = Column(Float)    # Mini-Mental State Examination (0-30)
    notes = Column(String)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="health_records")
