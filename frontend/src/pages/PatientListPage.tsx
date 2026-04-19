import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { getPatients } from '../utils/api';
import { Patient } from '../utils/types';

const levelColors: Record<string, string> = {
  mild: '#f39c12',
  moderate: '#e67e22',
  severe: '#c0392b',
  stage1: '#f1c40f',
  stage2: '#e67e22',
  crisis: '#c0392b',
};

export default function PatientListPage() {
  const { t } = useLanguage();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getPatients()
      .then(setPatients)
      .catch(() => setError(t.patientList.error))
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>{t.patientList.loading}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#2c3e50' }}>{t.patientList.title}</h1>
        <button
          onClick={() => navigate('/add-patient')}
          style={{ background: '#1a5276', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', cursor: 'pointer', fontSize: 15 }}
        >
          {t.patientList.addButton}
        </button>
      </div>
      {error && <div style={{ background: '#fadbd8', color: '#c0392b', padding: 12, borderRadius: 6, marginBottom: 16 }}>{error}</div>}
      {patients.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: 60, color: '#7f8c8d' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
          <div>{t.patientList.empty}</div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {patients.map(patient => (
          <div
            key={patient.id}
            onClick={() => navigate(`/patient/${patient.id}`)}
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
              border: '1px solid #eaecef',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#2c3e50' }}>{patient.name}</div>
                <div style={{ color: '#7f8c8d', fontSize: 13 }}>
                  {patient.age}岁 · {
                    patient.gender === 'male' ? t.patientList.genders.male :
                    patient.gender === 'female' ? t.patientList.genders.female :
                    t.patientList.genders.other
                  }
                </div>
              </div>
              <div style={{ fontSize: 28 }}>👤</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {patient.dementia_stage && (
                <span style={{
                  background: levelColors[patient.dementia_stage] || '#95a5a6',
                  color: '#fff',
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: 12
                }}>
                  痴呆 {t.patientList.severityLevels[patient.dementia_stage as keyof typeof t.patientList.severityLevels] || patient.dementia_stage}
                </span>
              )}
              {patient.hypertension_level && (
                <span style={{
                  background: levelColors[patient.hypertension_level] || '#95a5a6',
                  color: '#fff',
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: 12
                }}>
                  高血压 {t.patientList.severityLevels[patient.hypertension_level as keyof typeof t.patientList.severityLevels] || patient.hypertension_level}
                </span>
              )}
            </div>
            {patient.phone && (
              <div style={{ marginTop: 10, color: '#7f8c8d', fontSize: 13 }}>📞 {patient.phone}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
