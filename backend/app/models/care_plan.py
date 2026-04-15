from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class CarePlan(Base):
    __tablename__ = "care_plans"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    goals = Column(Text)
    interventions = Column(Text)
    status = Column(String, default="active")  # active, completed, cancelled
    created_by = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    patient = relationship("Patient", back_populates="care_plans")
