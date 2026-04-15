"""Seed demo data for testing."""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, engine, Base
from app.models.patient import Patient
from app.models.health_record import HealthRecord
from app.models.medication import Medication
from app.models.care_plan import CarePlan
from datetime import datetime, timedelta
import random

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Check if data already exists
if db.query(Patient).count() > 0:
    print("Data already seeded.")
    db.close()
    sys.exit(0)

# Create demo patients
patients = [
    Patient(name="李大妈", age=78, gender="female", phone="138-0001-0001",
            dementia_stage="mild", hypertension_level="stage2",
            emergency_contact="李小明", emergency_phone="138-0001-0002",
            address="北京市朝阳区幸福里小区12栋3单元401室"),
    Patient(name="王爷爷", age=85, gender="male", phone="139-0002-0003",
            dementia_stage="moderate", hypertension_level="stage1",
            emergency_contact="王芳", emergency_phone="139-0002-0004",
            address="上海市浦东新区康健路88号"),
    Patient(name="张奶奶", age=72, gender="female", phone="137-0003-0005",
            dementia_stage="severe", hypertension_level="crisis",
            emergency_contact="张建国", emergency_phone="137-0003-0006",
            address="广州市天河区天河路100号"),
]

for p in patients:
    db.add(p)
db.commit()

# Refresh to get IDs
for p in patients:
    db.refresh(p)

# Add health records
now = datetime.utcnow()
for patient in patients:
    for i in range(10):
        record_time = now - timedelta(days=9-i)
        base_systolic = 150 if patient.hypertension_level in ['stage2', 'crisis'] else 135
        record = HealthRecord(
            patient_id=patient.id,
            systolic_bp=base_systolic + random.randint(-10, 20),
            diastolic_bp=90 + random.randint(-5, 15),
            heart_rate=75 + random.randint(-10, 15),
            blood_glucose=110 + random.randint(-20, 40),
            weight=60 + random.randint(-5, 5),
            temperature=36.5 + round(random.uniform(-0.3, 0.8), 1),
            mmse_score=max(0, 22 - ({"mild": 0, "moderate": 8, "severe": 16}.get(patient.dementia_stage, 0)) + random.randint(-2, 2)),
            notes="常规检查记录",
            recorded_at=record_time,
        )
        db.add(record)

# Add medications
medications_data = [
    (patients[0].id, "苯磺酸氨氯地平片", "5mg", "once_daily", "hypertension", "控制血压"),
    (patients[0].id, "多奈哌齐", "5mg", "before_sleep", "dementia", "改善认知功能"),
    (patients[0].id, "阿司匹林肠溶片", "100mg", "once_daily", "prevention", "心血管预防"),
    (patients[1].id, "缬沙坦胶囊", "80mg", "once_daily", "hypertension", "降压治疗"),
    (patients[1].id, "美金刚", "10mg", "twice_daily", "dementia", "中重度阿尔茨海默病"),
    (patients[2].id, "硝苯地平控释片", "30mg", "once_daily", "hypertension", "控制高血压危象"),
    (patients[2].id, "利斯的明贴片", "4.6mg/24h", "once_daily", "dementia", "重度痴呆治疗"),
    (patients[2].id, "卡托普利片", "25mg", "twice_daily", "hypertension", "辅助降压"),
]

for pid, name, dosage, freq, purpose, notes in medications_data:
    db.add(Medication(
        patient_id=pid, name=name, dosage=dosage,
        frequency=freq, purpose=purpose, notes=notes,
        is_active=True, start_date=now - timedelta(days=30)
    ))

# Add care plans
care_plans_data = [
    (patients[0].id, "轻度痴呆综合护理方案", "针对轻度阿尔茨海默病合并高血压的综合护理", "维持现有认知水平，稳定控制血压", "每日认知训练，规律监测血压，社区活动参与", "active", "王医生"),
    (patients[1].id, "中度痴呆专项护理计划", "为中度痴呆患者提供安全、有尊严的护理", "减缓认知退化，预防跌倒，维持日常功能", "专业照护人员日间陪护，安全环境改造，音乐治疗", "active", "李护士"),
    (patients[2].id, "重度痴呆及高血压危象护理方案", "为重度痴呆合并高血压危象患者提供全方位护理", "稳定生命体征，保持舒适护理，预防并发症", "24小时专业护理，每小时血压监测，营养支持", "active", "张主任"),
]

for pid, title, desc, goals, interventions, status, created_by in care_plans_data:
    db.add(CarePlan(patient_id=pid, title=title, description=desc, goals=goals,
                    interventions=interventions, status=status, created_by=created_by))

db.commit()
db.close()
print("Demo data seeded successfully!")
print(f"Created {len(patients)} patients with health records, medications, and care plans.")
