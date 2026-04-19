import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../i18n/LanguageContext';
import { getPatient, getHealthRecords } from '../utils/api';
import { Patient, HealthRecord } from '../utils/types';

export default function HealthMonitoringPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const patientId = parseInt(id!);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    Promise.all([getPatient(patientId), getHealthRecords(patientId)])
      .then(([p, r]) => { setPatient(p); setRecords(r.reverse()); });
  }, [patientId]);

  const chartData = records.map(r => ({
    date: new Date(r.recorded_at).toLocaleDateString(navigator.language),
    systolic: r.systolic_bp,
    diastolic: r.diastolic_bp,
    heartRate: r.heart_rate,
    bloodGlucose: r.blood_glucose,
    mmse: r.mmse_score,
  }));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={() => navigate(`/patient/${patientId}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22 }}>←</button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#2c3e50' }}>
          {patient?.name} - {t.healthMonitoring.title.replace('{patientName}', patient?.name || '')}
        </h1>
      </div>

      {records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#7f8c8d' }}>
          {t.healthMonitoring.empty}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 24 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h2 style={{ marginBottom: 16, fontSize: 16 }}>{t.healthMonitoring.charts.bloodPressure}</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[60, 200]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="systolic" name={t.healthMonitoring.dataLabels.systolic} stroke="#e74c3c" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="diastolic" name={t.healthMonitoring.dataLabels.diastolic} stroke="#3498db" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h2 style={{ marginBottom: 16, fontSize: 16 }}>{t.healthMonitoring.charts.heartRate}</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[40, 120]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="heartRate" name={t.healthMonitoring.dataLabels.heartRate} stroke="#e67e22" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h2 style={{ marginBottom: 16, fontSize: 16 }}>{t.healthMonitoring.charts.mmse}</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 30]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="mmse" name={t.healthMonitoring.dataLabels.mmse} stroke="#8e44ad" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent records table */}
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h2 style={{ marginBottom: 16, fontSize: 16 }}>{t.healthMonitoring.recentRecords}</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f4f6f8' }}>
                    {[
                      t.healthMonitoring.tableHeaders.recordTime,
                      t.healthMonitoring.tableHeaders.systolic,
                      t.healthMonitoring.tableHeaders.diastolic,
                      t.healthMonitoring.tableHeaders.heartRate,
                      t.healthMonitoring.tableHeaders.bloodSugar,
                      t.healthMonitoring.tableHeaders.weight,
                      t.healthMonitoring.tableHeaders.temperature,
                      t.healthMonitoring.tableHeaders.mmse,
                      t.healthMonitoring.tableHeaders.notes
                    ].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#7f8c8d', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.slice(0, 15).map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '8px 12px' }}>{new Date(r.recorded_at).toLocaleString(navigator.language)}</td>
                      <td style={{ padding: '8px 12px' }}>{r.systolic_bp ?? '-'}</td>
                      <td style={{ padding: '8px 12px' }}>{r.diastolic_bp ?? '-'}</td>
                      <td style={{ padding: '8px 12px' }}>{r.heart_rate ?? '-'}</td>
                      <td style={{ padding: '8px 12px' }}>{r.blood_glucose ?? '-'}</td>
                      <td style={{ padding: '8px 12px' }}>{r.weight ?? '-'}</td>
                      <td style={{ padding: '8px 12px' }}>{r.temperature ?? '-'}</td>
                      <td style={{ padding: '8px 12px' }}>{r.mmse_score ?? '-'}</td>
                      <td style={{ padding: '8px 12px' }}>{r.notes ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
