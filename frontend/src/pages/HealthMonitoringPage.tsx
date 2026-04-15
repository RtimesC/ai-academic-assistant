import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPatient, getHealthRecords } from '../utils/api';
import { Patient, HealthRecord } from '../utils/types';

export default function HealthMonitoringPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patientId = parseInt(id!);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    Promise.all([getPatient(patientId), getHealthRecords(patientId)])
      .then(([p, r]) => { setPatient(p); setRecords(r.reverse()); });
  }, [patientId]);

  const chartData = records.map(r => ({
    date: new Date(r.recorded_at).toLocaleDateString('zh-CN'),
    收缩压: r.systolic_bp,
    舒张压: r.diastolic_bp,
    心率: r.heart_rate,
    血糖: r.blood_glucose,
    MMSE: r.mmse_score,
  }));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={() => navigate(`/patient/${patientId}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22 }}>←</button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#2c3e50' }}>
          {patient?.name} - 健康监控
        </h1>
      </div>

      {records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#7f8c8d' }}>
          暂无健康记录。请先录入健康数据。
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 24 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h2 style={{ marginBottom: 16, fontSize: 16 }}>血压趋势 (mmHg)</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[60, 200]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="收缩压" stroke="#e74c3c" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="舒张压" stroke="#3498db" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h2 style={{ marginBottom: 16, fontSize: 16 }}>心率趋势 (bpm)</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[40, 120]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="心率" stroke="#e67e22" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h2 style={{ marginBottom: 16, fontSize: 16 }}>MMSE 认知评分</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 30]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="MMSE" stroke="#8e44ad" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent records table */}
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h2 style={{ marginBottom: 16, fontSize: 16 }}>最近健康记录</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f4f6f8' }}>
                    {['记录时间','收缩压','舒张压','心率','血糖','体重','体温','MMSE','备注'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#7f8c8d', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.slice().slice(0, 15).map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '8px 12px' }}>{new Date(r.recorded_at).toLocaleString('zh-CN')}</td>
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
