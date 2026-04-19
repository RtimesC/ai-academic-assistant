import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { createHealthRecord } from '../utils/api';

interface Props { patientId: number; onClose: () => void; }

export default function AddHealthRecordModal({ patientId, onClose }: Props) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ systolic_bp: '', diastolic_bp: '', heart_rate: '', blood_glucose: '', weight: '', temperature: '', mmse_score: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const toNum = (v: string) => v !== '' ? parseFloat(v) : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createHealthRecord({
        patient_id: patientId,
        systolic_bp: toNum(form.systolic_bp),
        diastolic_bp: toNum(form.diastolic_bp),
        heart_rate: toNum(form.heart_rate),
        blood_glucose: toNum(form.blood_glucose),
        weight: toNum(form.weight),
        temperature: toNum(form.temperature),
        mmse_score: toNum(form.mmse_score),
        notes: form.notes || undefined,
      });
      onClose();
    } catch { setError(t.addHealthRecord.error); } finally { setSaving(false); }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: 5, fontSize: 14 };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, color: '#555', marginBottom: 3 };

  const fields = [
    ['systolic_bp', t.addHealthRecord.fields.systolic],
    ['diastolic_bp', t.addHealthRecord.fields.diastolic],
    ['heart_rate', t.addHealthRecord.fields.heartRate],
    ['blood_glucose', t.addHealthRecord.fields.bloodSugar],
    ['weight', t.addHealthRecord.fields.weight],
    ['temperature', t.addHealthRecord.fields.temperature],
    ['mmse_score', t.addHealthRecord.fields.mmse],
  ];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: 480, maxWidth: '95vw', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{t.addHealthRecord.title}</h2>
        {error && <div style={{ background: '#fadbd8', color: '#c0392b', padding: 8, borderRadius: 5, marginBottom: 12 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {fields.map(([name, label]) => (
              <div key={name}>
                <label style={labelStyle}>{label}</label>
                <input name={name} type="number" step="0.1" value={(form as any)[name]} onChange={handleChange} style={inputStyle} />
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>{t.addHealthRecord.fields.notes}</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} style={{ ...inputStyle, height: 60, resize: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="submit" disabled={saving} style={{ flex: 1, background: '#27ae60', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 15, cursor: 'pointer' }}>
              {saving ? t.addHealthRecord.buttons.saving : t.addHealthRecord.buttons.save}
            </button>
            <button type="button" onClick={onClose} style={{ flex: 1, background: '#ecf0f1', color: '#2c3e50', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 15, cursor: 'pointer' }}>
              {t.addHealthRecord.buttons.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
