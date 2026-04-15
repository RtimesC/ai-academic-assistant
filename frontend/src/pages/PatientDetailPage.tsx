import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const priorityLabels: Record<string, string> = {
  critical: '紧急',
  high: '重要',
  medium: '建议',
  low: '一般',
};

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>加载中...</div>;
  if (!patient) return <div style={{ textAlign: 'center', padding: 60, color: '#c0392b' }}>患者不存在</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22 }}>←</button>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#2c3e50' }}>{patient.name}</h1>
          <div style={{ color: '#7f8c8d', fontSize: 14 }}>
            {patient.age} 岁 · {patient.gender === 'male' ? '男' : patient.gender === 'female' ? '女' : '其他'}
            {patient.phone && ` · 📞 ${patient.phone}`}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            onClick={() => navigate(`/patient/${patientId}/health`)}
            style={{ background: '#2980b9', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}
          >
            📈 健康监控
          </button>
          <button
            onClick={() => setShowHealthModal(true)}
            style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}
          >
            + 录入健康数据
          </button>
        </div>
      </div>

      {/* Alerts */}
      {summary && summary.alerts.critical_count > 0 && (
        <div style={{ background: '#fadbd8', border: '1px solid #c0392b', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: '#c0392b', marginBottom: 8 }}>⚠️ 紧急警报 ({summary.alerts.critical_count})</div>
          {summary.alerts.alerts.filter(a => a.type === 'critical').map((alert, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              <strong>{alert.category}：</strong>{alert.message} <em style={{ color: '#e74c3c' }}>→ {alert.action}</em>
            </div>
          ))}
        </div>
      )}

      {/* Risk Score */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: riskColors[summary.risk_assessment.overall_level] }}>
              {summary.risk_assessment.risk_score}
            </div>
            <div style={{ color: '#7f8c8d', fontSize: 13 }}>风险评分</div>
            <div style={{ fontWeight: 600, color: riskColors[summary.risk_assessment.overall_level] }}>
              {summary.risk_assessment.overall_label}
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#2980b9' }}>{summary.active_medications_count}</div>
            <div style={{ color: '#7f8c8d', fontSize: 13 }}>当前用药数</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: summary.alerts.total_alerts > 0 ? '#e67e22' : '#27ae60' }}>
              {summary.alerts.total_alerts}
            </div>
            <div style={{ color: '#7f8c8d', fontSize: 13 }}>健康警报</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#8e44ad' }}>{summary.recommendations.total_count}</div>
            <div style={{ color: '#7f8c8d', fontSize: 13 }}>护理建议</div>
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
            {tab === 'overview' ? '概览 & AI建议' : tab === 'medications' ? '用药管理' : '护理计划'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && summary && (
        <div>
          {/* Risk Factors */}
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🔍 风险因素分析</h2>
            {summary.risk_assessment.risk_factors.length === 0 ? (
              <div style={{ color: '#27ae60' }}>✅ 暂无明显风险因素</div>
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
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>💡 AI 护理建议</h2>
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
                    {priorityLabels[rec.priority] || rec.priority}
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
              + 添加药物
            </button>
          </div>
          {medications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#7f8c8d' }}>暂无用药记录</div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {medications.map(med => (
                <div key={med.id} style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#2c3e50' }}>{med.name}</div>
                    <div style={{ color: '#7f8c8d', fontSize: 13 }}>
                      {med.dosage && `剂量：${med.dosage} · `}
                      {med.frequency && `频率：${med.frequency} · `}
                      {med.purpose && `用途：${med.purpose}`}
                    </div>
                    {med.notes && <div style={{ color: '#95a5a6', fontSize: 12, marginTop: 4 }}>{med.notes}</div>}
                  </div>
                  <span style={{
                    background: med.is_active ? '#eafaf1' : '#f2f3f4',
                    color: med.is_active ? '#27ae60' : '#95a5a6',
                    borderRadius: 4, padding: '3px 10px', fontSize: 13, fontWeight: 600
                  }}>
                    {med.is_active ? '使用中' : '已停用'}
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
            <div style={{ textAlign: 'center', padding: 40, color: '#7f8c8d' }}>暂无护理计划</div>
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
                      {plan.status === 'active' ? '执行中' : plan.status === 'completed' ? '已完成' : '已取消'}
                    </span>
                  </div>
                  {plan.description && <div style={{ color: '#555', fontSize: 14, marginBottom: 8 }}>{plan.description}</div>}
                  {plan.goals && <div style={{ color: '#555', fontSize: 14 }}><strong>目标：</strong>{plan.goals}</div>}
                  {plan.interventions && <div style={{ color: '#555', fontSize: 14 }}><strong>干预措施：</strong>{plan.interventions}</div>}
                  {plan.created_by && <div style={{ color: '#95a5a6', fontSize: 12, marginTop: 6 }}>制定人：{plan.created_by}</div>}
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
