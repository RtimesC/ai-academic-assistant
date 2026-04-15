from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    name = Column(String, nullable=False)
    dosage = Column(String)
    frequency = Column(String)  # once_daily, twice_daily, etc.
    purpose = Column(String)    # dementia, hypertension, etc.
    start_date = Column(DateTime)
    end_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    notes = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="medications")
