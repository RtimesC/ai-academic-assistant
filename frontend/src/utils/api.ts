import axios from 'axios';
import { Patient, HealthRecord, Medication, CarePlan, RiskAssessment, AlertSummary, CareRecommendations, DashboardSummary } from './types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: API_BASE });

// Patients
export const getPatients = () => api.get<Patient[]>('/patients/').then(r => r.data);
export const getPatient = (id: number) => api.get<Patient>(`/patients/${id}`).then(r => r.data);
export const createPatient = (data: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) =>
  api.post<Patient>('/patients/', data).then(r => r.data);
export const updatePatient = (id: number, data: Partial<Patient>) =>
  api.put<Patient>(`/patients/${id}`, data).then(r => r.data);
export const deletePatient = (id: number) => api.delete(`/patients/${id}`).then(r => r.data);

// Health Records
export const getHealthRecords = (patientId: number) =>
  api.get<HealthRecord[]>(`/health-records/patient/${patientId}`).then(r => r.data);
export const createHealthRecord = (data: Omit<HealthRecord, 'id' | 'recorded_at'>) =>
  api.post<HealthRecord>('/health-records/', data).then(r => r.data);

// Medications
export const getMedications = (patientId: number, activeOnly = false) =>
  api.get<Medication[]>(`/medications/patient/${patientId}`, { params: { active_only: activeOnly } }).then(r => r.data);
export const createMedication = (data: Omit<Medication, 'id' | 'created_at'>) =>
  api.post<Medication>('/medications/', data).then(r => r.data);
export const updateMedication = (id: number, data: Partial<Medication>) =>
  api.put<Medication>(`/medications/${id}`, data).then(r => r.data);

// Care Plans
export const getCarePlans = (patientId: number) =>
  api.get<CarePlan[]>(`/care-plans/patient/${patientId}`).then(r => r.data);
export const createCarePlan = (data: Omit<CarePlan, 'id' | 'created_at' | 'updated_at'>) =>
  api.post<CarePlan>('/care-plans/', data).then(r => r.data);
export const updateCarePlan = (id: number, data: Partial<CarePlan>) =>
  api.put<CarePlan>(`/care-plans/${id}`, data).then(r => r.data);

// AI
export const getRiskAssessment = (patientId: number) =>
  api.get<RiskAssessment>(`/ai/risk-assessment/${patientId}`).then(r => r.data);
export const getCareRecommendations = (patientId: number) =>
  api.get<CareRecommendations>(`/ai/care-recommendations/${patientId}`).then(r => r.data);
export const getPatientAlerts = (patientId: number) =>
  api.get<AlertSummary>(`/ai/alerts/${patientId}`).then(r => r.data);
export const getDashboardSummary = (patientId: number) =>
  api.get<DashboardSummary>(`/ai/dashboard-summary/${patientId}`).then(r => r.data);
