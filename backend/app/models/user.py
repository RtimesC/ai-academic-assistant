from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum as SQLEnum
from datetime import datetime
import enum
from sqlalchemy.orm import relationship
from app.main import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"  # 医疗机构管理员
    DOCTOR = "doctor"  # 医生
    PATIENT = "patient"  # 患者

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)  # 使用 hash 存储，不存储明文
    role = Column(SQLEnum(UserRole), default=UserRole.DOCTOR)
    organization_id = Column(Integer)  # 所属医疗机构 ID
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    # 关系
    audit_logs = relationship("AuditLog", back_populates="user")

    def __repr__(self):
        return f"<User {self.username} ({self.role})>"
