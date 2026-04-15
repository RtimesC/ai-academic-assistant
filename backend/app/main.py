from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import patients, health_records, medications, care_plans, ai_recommendations

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Care Assistant API",
    description="AI Agent for Integrated Care of Dementia and Hypertension Elderly Patients",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patients.router)
app.include_router(health_records.router)
app.include_router(medications.router)
app.include_router(care_plans.router)
app.include_router(ai_recommendations.router)

@app.get("/")
def root():
    return {
        "message": "AI Care Assistant API",
        "version": "1.0.0",
        "description": "AI Agent for Integrated Care of Dementia and Hypertension Elderly Patients"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
