import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { getPatient, getDashboardSummary, getCarePlans, getMedications } from '../utils/api';
import { Patient, DashboardSummary, CarePlan, Medication } from '../utils/types';
import AddHealthRecordModal from '../components/AddHealthRecordModal';
import AddMedicationModal from '../components/AddMedicationModal';

const riskColors: Record<string, string> = {
  critical: '#c0392b',
  high: '#e67e22',
  medium: '#f39c12',
  low: '#27ae60',
};

const priorityColors: Record<string, string> = {
  critical: '#fadbd8',
  high: '#fdebd0',
  medium: '#fef9e7',
  low: '#eafaf1',
};

const priorityBorder: Record<string, string> = {
  critical: '#c0392b',
  high: '#e67e22',
  medium: '#f39c12',
  low: '#27ae60',
};

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const patientId = parseInt(id!);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [carePlans, setCarePlans] = useState<CarePlan[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showMedModal, setShowMedModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'medications' | 'care-plans'>('overview');

  const loadData = useCallback(() => {
    Promise.all([
      getPatient(patientId),
      getDashboardSummary(patientId).catch(() => null),
      getCarePlans(patientId).catch(() => []),
      getMedications(patientId).catch(() => []),
    ]).then(([p, s, cp, meds]) => {
      setPatient(p);
      setSummary(s);
      setCarePlans(cp);
      setMedications(meds);
      setLoading(false);
    });
  }, [patientId]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>{t.patientDetail.loading}</div>;
  if (!patient) return <div style={{ textAlign: 'center', padding: 60, color: '#c0392b' }}>{t.patientDetail.notFound}</div>;

  const getGenderLabel = (gender: string) => {
    if (gender === 'male') return t.patientList.genders.male;
    if (gender === 'female') return t.patientList.genders.female;
    return t.patientList.genders.other;
  };

  const getPriorityLabel = (priority: string): string => {
    if (priority === 'critical') return t.patientDetail.priorities.urgent;
    if (priority === 'high') return t.patientDetail.priorities.important;
    if (priority === 'medium') return t.patientDetail.priorities.recommend;
    return t.patientDetail.priorities.general;
  };

  const getCarePlanStatusLabel = (status: string): string => {
    if (status === 'active') return t.patientDetail.carePlan.status.active;
    if (status === 'completed') return t.patientDetail.carePlan.status.completed;
    return t.patientDetail.carePlan.status.cancelled;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22 }}>←</button>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#2c3e50' }}>{patient.name}</h1>
          <div style={{ color: '#7f8c8d', fontSize: 14 }}>
            {patient.age}岁 · {getGenderLabel(patient.gender)}
            {patient.phone && ` · 📞 ${patient.phone}`}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            onClick={() => navigate(`/patient/${patientId}/health`)}
            style={{ background: '#2980b9', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}
          >
            {t.patientDetail.healthMonitor}
          </button>
          <button
            onClick={() => setShowHealthModal(true)}
            style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}
          >
            {t.patientDetail.addHealthRecord}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {summary && summary.alerts.critical_count > 0 && (
        <div style={{ background: '#fadbd8', border: '1px solid #c0392b', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: '#c0392b', marginBottom: 8 }}>
            {t.patientDetail.alerts.replace('{count}', summary.alerts.critical_count.toString())}
          </div>
          {summary.alerts.alerts.filter(a => a.type === 'critical').map((alert, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              <strong>{alert.category}：</strong>{alert.message} <em style={{ color: '#e74c3c' }}>→ {alert.action}</em>
            </div>
          ))}
        </div>
      )}

      {/* Risk Score Cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: riskColors[summary.risk_assessment.overall_level] }}>
              {summary.risk_assessment.risk_score}
            </div>
            <div style={{ color: '#7f8c8d', fontSize: 13 }}>{t.patientDetail.cards.riskScore}</div>
            <div style={{ fontWeight: 600, color: riskColors[summary.risk_assessment.overall_level] }}>
              {summary.risk_assessment.overall_label}
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#2980b9' }}>{summary.active_medications_count}</div>
            <div style={{ color: '#7f8c8d', fontSize: 13 }}>{t.patientDetail.cards.currentMedications}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: summary.alerts.total_alerts > 0 ? '#e67e22' : '#27ae60' }}>
              {summary.alerts.total_alerts}
            </div>
            <div style={{ color: '#7f8c8d', fontSize: 13 }}>{t.patientDetail.cards.healthAlerts}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#8e44ad' }}>{summary.recommendations.total_count}</div>
            <div style={{ color: '#7f8c8d', fontSize: 13 }}>{t.patientDetail.cards.careRecommendations}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ borderBottom: '2px solid #eaecef', marginBottom: 20, display: 'flex', gap: 0 }}>
        {(['overview', 'medications', 'care-plans'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none', border: 'none', padding: '10px 24px', fontSize: 15, cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid #1a5276' : '2px solid transparent',
              color: activeTab === tab ? '#1a5276' : '#7f8c8d',
              fontWeight: activeTab === tab ? 700 : 400,
              marginBottom: -2,
            }}
          >
            {tab === 'overview' && t.patientDetail.tabs.overview}
            {tab === 'medications' && t.patientDetail.tabs.medications}
            {tab === 'care-plans' && t.patientDetail.tabs.carePlan}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && summary && (
        <div>
          {/* Risk Factors */}
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{t.patientDetail.riskFactors.title}</h2>
            {summary.risk_assessment.risk_factors.length === 0 ? (
              <div style={{ color: '#27ae60' }}>{t.patientDetail.riskFactors.noRisk}</div>
            ) : (
              summary.risk_assessment.risk_factors.map((rf, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{
                    background: riskColors[rf.level] || '#95a5a6',
                    color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 12, minWidth: 48, textAlign: 'center'
                  }}>
                    {rf.factor}
                  </span>
                  <span style={{ color: '#2c3e50', fontSize: 14 }}>{rf.detail}</span>
                </div>
              ))
            )}
          </div>

          {/* Recommendations */}
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{t.patientDetail.careAdvice.title}</h2>
            {summary.recommendations.recommendations.map((rec, i) => (
              <div key={i} style={{
                background: priorityColors[rec.priority] || '#f8f9fa',
                borderLeft: `4px solid ${priorityBorder[rec.priority] || '#95a5a6'}`,
                borderRadius: '0 6px 6px 0',
                padding: '10px 14px',
                marginBottom: 8,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ color: '#2c3e50' }}>{rec.category}</strong>
                  <span style={{
                    fontSize: 11,
                    background: priorityBorder[rec.priority],
                    color: '#fff',
                    borderRadius: 3,
                    padding: '1px 6px',
                  }}>
                    {getPriorityLabel(rec.priority)}
                  </span>
                </div>
                <div style={{ color: '#555', fontSize: 14 }}>{rec.recommendation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'medications' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button
              onClick={() => setShowMedModal(true)}
              style={{ background: '#1a5276', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}
            >
              {t.patientDetail.medications.addButton}
            </button>
          </div>
          {medications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#7f8c8d' }}>{t.patientDetail.medications.empty}</div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {medications.map(med => (
                <div key={med.id} style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#2c3e50' }}>{med.name}</div>
                    <div style={{ color: '#7f8c8d', fontSize: 13 }}>
                      {med.dosage && `${t.patientDetail.medications.dose}${med.dosage} · `}
                      {med.frequency && `${t.patientDetail.medications.frequency}${med.frequency} · `}
                      {med.purpose && `${t.patientDetail.medications.purpose}${med.purpose}`}
                    </div>
                    {med.notes && <div style={{ color: '#95a5a6', fontSize: 12, marginTop: 4 }}>{med.notes}</div>}
                  </div>
                  <span style={{
                    background: med.is_active ? '#eafaf1' : '#f2f3f4',
                    color: med.is_active ? '#27ae60' : '#95a5a6',
                    borderRadius: 4, padding: '3px 10px', fontSize: 13, fontWeight: 600
                  }}>
                    {med.is_active ? t.patientDetail.medications.status.active : t.patientDetail.medications.status.discontinued}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'care-plans' && (
        <div>
          {carePlans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#7f8c8d' }}>{t.patientDetail.carePlan.empty}</div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {carePlans.map(plan => (
                <div key={plan.id} style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, color: '#2c3e50', fontSize: 16 }}>{plan.title}</div>
                    <span style={{
                      background: plan.status === 'active' ? '#eafaf1' : '#f2f3f4',
                      color: plan.status === 'active' ? '#27ae60' : '#95a5a6',
                      borderRadius: 4, padding: '3px 10px', fontSize: 13
                    }}>
                      {getCarePlanStatusLabel(plan.status)}
                    </span>
                  </div>
                  {plan.description && <div style={{ color: '#555', fontSize: 14, marginBottom: 8 }}>{plan.description}</div>}
                  {plan.goals && <div style={{ color: '#555', fontSize: 14 }}><strong>{t.patientDetail.carePlan.fields.goal}</strong>{plan.goals}</div>}
                  {plan.interventions && <div style={{ color: '#555', fontSize: 14 }}><strong>{t.patientDetail.carePlan.fields.interventions}</strong>{plan.interventions}</div>}
                  {plan.created_by && <div style={{ color: '#95a5a6', fontSize: 12, marginTop: 6 }}>{t.patientDetail.carePlan.fields.createdBy}{plan.created_by}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showHealthModal && (
        <AddHealthRecordModal patientId={patientId} onClose={() => { setShowHealthModal(false); loadData(); }} />
      )}
      {showMedModal && (
        <AddMedicationModal patientId={patientId} onClose={() => { setShowMedModal(false); loadData(); }} />
      )}
    </div>
  );
}
