from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.routes import patients, health_records, medications, care_plans, ai_recommendations, auth
from app.middleware.audit_logging import AuditLoggingMiddleware
from app.models.user import User
from app.models.audit_log import AuditLog

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize test users
db = SessionLocal()
auth.init_test_users(db)
db.close()

app = FastAPI(
    title="AI Care Assistant API",
    description="AI Agent for Integrated Care of Dementia and Hypertension Elderly Patients",
    version="2.0.0 (with Auth & RBAC)",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add audit logging middleware
app.add_middleware(AuditLoggingMiddleware)

# Include routers
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(health_records.router)
app.include_router(medications.router)
app.include_router(care_plans.router)
app.include_router(ai_recommendations.router)

@app.get("/")
def root():
    return {
        "message": "AI Care Assistant API v2.0",
        "version": "2.0.0",
        "description": "AI Agent for Integrated Care of Dementia and Hypertension Elderly Patients",
        "features": {
            "authentication": "JWT Token-based",
            "authorization": "Role-Based Access Control (RBAC)",
            "audit": "All user actions are logged",
            "roles": ["admin", "doctor", "patient"]
        },
        "test_accounts": {
            "admin": {"username": "admin", "password": "123456"},
            "doctor": {"username": "doctor", "password": "123456"},
            "patient": {"username": "patient", "password": "123456"}
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
