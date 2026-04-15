import React, { useState } from 'react';
import { createMedication } from '../utils/api';

interface Props { patientId: number; onClose: () => void; }

export default function AddMedicationModal({ patientId, onClose }: Props) {
  const [form, setForm] = useState({ name: '', dosage: '', frequency: 'once_daily', purpose: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { setError('请输入药物名称'); return; }
    setSaving(true);
    try {
      await createMedication({ patient_id: patientId, ...form, is_active: true } as any);
      onClose();
    } catch { setError('保存失败'); } finally { setSaving(false); }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: 5, fontSize: 14 };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, color: '#555', marginBottom: 3 };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: 440, maxWidth: '95vw', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>添加药物</h2>
        {error && <div style={{ background: '#fadbd8', color: '#c0392b', padding: 8, borderRadius: 5, marginBottom: 12 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <label style={labelStyle}>药物名称 *</label>
              <input name="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder="如：苯磺酸氨氯地平片" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>剂量</label>
                <input name="dosage" value={form.dosage} onChange={handleChange} style={inputStyle} placeholder="如：5mg" />
              </div>
              <div>
                <label style={labelStyle}>服用频率</label>
                <select name="frequency" value={form.frequency} onChange={handleChange} style={inputStyle}>
                  <option value="once_daily">每日一次</option>
                  <option value="twice_daily">每日两次</option>
                  <option value="three_times_daily">每日三次</option>
                  <option value="four_times_daily">每日四次</option>
                  <option value="with_meals">随餐服用</option>
                  <option value="before_sleep">睡前服用</option>
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>用途</label>
              <input name="purpose" value={form.purpose} onChange={handleChange} style={inputStyle} placeholder="如：高血压、痴呆" />
            </div>
            <div>
              <label style={labelStyle}>备注</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} style={{ ...inputStyle, height: 56, resize: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="submit" disabled={saving} style={{ flex: 1, background: '#1a5276', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 15, cursor: 'pointer' }}>
              {saving ? '保存中...' : '保存'}
            </button>
            <button type="button" onClick={onClose} style={{ flex: 1, background: '#ecf0f1', color: '#2c3e50', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 15, cursor: 'pointer' }}>
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
