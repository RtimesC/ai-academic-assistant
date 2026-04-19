import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { createMedication } from '../utils/api';

interface Props { patientId: number; onClose: () => void; }

export default function AddMedicationModal({ patientId, onClose }: Props) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', dosage: '', frequency: 'once_daily', purpose: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { setError(t.addMedication.validation.nameRequired); return; }
    setSaving(true);
    try {
      await createMedication({ patient_id: patientId, ...form, is_active: true } as any);
      onClose();
    } catch { setError(t.addMedication.error); } finally { setSaving(false); }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: 5, fontSize: 14 };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, color: '#555', marginBottom: 3 };

  const frequencyOptions = [
    { value: 'once_daily', label: t.addMedication.frequencyOptions.onceDaily },
    { value: 'twice_daily', label: t.addMedication.frequencyOptions.twiceDaily },
    { value: 'three_times_daily', label: t.addMedication.frequencyOptions.threeTimesDaily },
    { value: 'four_times_daily', label: t.addMedication.frequencyOptions.fourTimesDaily },
    { value: 'with_meals', label: t.addMedication.frequencyOptions.withMeals },
    { value: 'before_sleep', label: t.addMedication.frequencyOptions.beforeBed },
  ];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: 440, maxWidth: '95vw', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{t.addMedication.title}</h2>
        {error && <div style={{ background: '#fadbd8', color: '#c0392b', padding: 8, borderRadius: 5, marginBottom: 12 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <label style={labelStyle}>{t.addMedication.fields.name}</label>
              <input name="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder={t.addMedication.placeholders.name} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>{t.addMedication.fields.dose}</label>
                <input name="dosage" value={form.dosage} onChange={handleChange} style={inputStyle} placeholder={t.addMedication.placeholders.dose} />
              </div>
              <div>
                <label style={labelStyle}>{t.addMedication.fields.frequency}</label>
                <select name="frequency" value={form.frequency} onChange={handleChange} style={inputStyle}>
                  {frequencyOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t.addMedication.fields.purpose}</label>
              <input name="purpose" value={form.purpose} onChange={handleChange} style={inputStyle} placeholder={t.addMedication.placeholders.purpose} />
            </div>
            <div>
              <label style={labelStyle}>{t.addMedication.fields.notes}</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} style={{ ...inputStyle, height: 56, resize: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="submit" disabled={saving} style={{ flex: 1, background: '#1a5276', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 15, cursor: 'pointer' }}>
              {saving ? t.addMedication.buttons.saving : t.addMedication.buttons.save}
            </button>
            <button type="button" onClick={onClose} style={{ flex: 1, background: '#ecf0f1', color: '#2c3e50', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 15, cursor: 'pointer' }}>
              {t.addMedication.buttons.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
