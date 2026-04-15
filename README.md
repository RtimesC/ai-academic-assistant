# AI Agent for Integrated Care of Dementia and Hypertension Elderly Patients

## Project Title
AI Agent for Integrated Care of Dementia and Hypertension Elderly Patients

## Objectives
- Develop an AI-based solution to assist in the integrated care of elderly patients suffering from dementia and hypertension.
- Enhance communication between patients and healthcare providers.
- Provide personalized care plans based on individual patient needs.

## Scope
- The project will focus on creating an AI agent that can support elderly patients in managing their health conditions.
- The solution will encompass features such as medication reminders, symptom tracking, and regular health monitoring.
- It aims to integrate with existing healthcare systems for seamless data sharing.

## Team Members
- **Yantao Wang** - Project Manager  
- **Yixing Zeng** - AI Engineer  
- **Jingyu Li** - Backend Engineer  
- **Yijie Lin** - Frontend Designer  
- **Feiyu Xia** - Business Analyst  

## Timeline
- Weeks 6-10: Development Phase  
  - Week 6: Initial design and architecture  
  - Week 7: Data collection and model training  
  - Week 8: Prototyping and testing  
  - Week 9: Feedback iteration and adjustments  
  - Week 10: Final evaluation

## Project Management Approach
- Agile methodology will be employed for this project, allowing for flexibility and iterative progress through sprints. Regular stand-ups and sprint reviews will be held to ensure alignment and address any challenges promptly.

---

## Architecture

| Layer | Technology |
|-------|-----------|
| Backend API | Python FastAPI + SQLAlchemy + SQLite |
| AI Module | Rule-based risk scoring (scikit-learn ready) |
| Frontend | React 18 + TypeScript |
| Deployment | Docker Compose |

### Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── database.py          # SQLAlchemy engine & session
│   │   ├── models/              # ORM models (Patient, HealthRecord, Medication, CarePlan)
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── routes/              # API routers
│   │   └── services/
│   │       └── ai_service.py    # Risk assessment & care recommendation engine
│   ├── seed_data.py             # Demo data seeder
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── public/index.html
│   └── src/
│       ├── App.tsx
│       ├── index.tsx
│       ├── pages/               # PatientList, PatientDetail, AddPatient, HealthMonitoring
│       ├── components/          # AddHealthRecordModal, AddMedicationModal
│       └── utils/               # api.ts (Axios), types.ts
├── docker-compose.yml
└── README.md
```

## Quick Start

### Option A — Docker Compose (recommended)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:8000  
- API Docs (Swagger): http://localhost:8000/docs

### Option B — Local development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python seed_data.py          # load demo patients
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

## Key Features

- **Patient Management** — CRUD for elderly patient records with dementia stage and hypertension level
- **Health Monitoring** — Time-series charts for blood pressure, heart rate, MMSE cognitive score, blood glucose
- **AI Risk Assessment** — Composite risk scoring (0–100) based on age, vitals, dementia stage, and hypertension level
- **Smart Alerts** — Real-time critical alerts for hypertensive crisis, hypoglycaemia, fever, bradycardia
- **Care Recommendations** — Priority-ranked, condition-specific nursing interventions (Chinese-language)
- **Medication Management** — Active medication tracking with daily reminder schedule generation
- **Care Plans** — Structured care plan creation and status tracking

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/patients/` | List all patients |
| POST | `/patients/` | Create patient |
| GET | `/patients/{id}` | Get patient |
| GET | `/health-records/patient/{id}` | Get health records |
| POST | `/health-records/` | Create health record |
| GET | `/medications/patient/{id}` | Get medications |
| GET | `/ai/risk-assessment/{id}` | AI risk score |
| GET | `/ai/alerts/{id}` | Health alerts |
| GET | `/ai/care-recommendations/{id}` | Care recommendations |
| GET | `/ai/dashboard-summary/{id}` | Full dashboard data |
