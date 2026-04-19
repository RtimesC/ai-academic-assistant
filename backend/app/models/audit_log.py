from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship
from app.main import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String)  # 'view_patient', 'update_health_record', 'add_medication', etc.
    resource_type = Column(String)  # 'patient', 'health_record', 'medication', etc.
    resource_id = Column(Integer)  # 被操作的资源 ID
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String)
    details = Column(Text)  # JSON 格式的详细信息

    # 关系
    user = relationship("User", back_populates="audit_logs")

    def __repr__(self):
        return f"<AuditLog {self.user_id} - {self.action} on {self.resource_type}:{self.resource_id}>"
