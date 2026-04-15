export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  dementia_stage?: string;
  hypertension_level?: string;
  created_at: string;
  updated_at: string;
}

export interface HealthRecord {
  id: number;
  patient_id: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  heart_rate?: number;
  blood_glucose?: number;
  weight?: number;
  temperature?: number;
  mmse_score?: number;
  notes?: string;
  recorded_at: string;
}

export interface Medication {
  id: number;
  patient_id: number;
  name: string;
  dosage?: string;
  frequency?: string;
  purpose?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
}

export interface CarePlan {
  id: number;
  patient_id: number;
  title: string;
  description?: string;
  goals?: string;
  interventions?: string;
  status: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface RiskFactor {
  factor: string;
  level: string;
  detail: string;
}

export interface RiskAssessment {
  patient_id: number;
  risk_score: number;
  overall_level: string;
  overall_label: string;
  risk_factors: RiskFactor[];
  assessed_at: string;
}

export interface Alert {
  type: string;
  category: string;
  message: string;
  action: string;
}

export interface AlertSummary {
  patient_id: number;
  total_alerts: number;
  critical_count: number;
  alerts: Alert[];
  checked_at: string;
}

export interface Recommendation {
  category: string;
  priority: string;
  recommendation: string;
}

export interface CareRecommendations {
  patient_id: number;
  patient_name: string;
  recommendations: Recommendation[];
  total_count: number;
  generated_at: string;
}

export interface DashboardSummary {
  patient: {
    id: number;
    name: string;
    age: number;
    dementia_stage?: string;
    hypertension_level?: string;
  };
  risk_assessment: RiskAssessment;
  alerts: AlertSummary;
  recommendations: CareRecommendations;
  active_medications_count: number;
}
