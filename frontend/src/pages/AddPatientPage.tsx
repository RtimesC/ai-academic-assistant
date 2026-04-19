import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { createPatient } from '../utils/api';

export default function AddPatientPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'female',
    phone: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    dementia_stage: '',
    hypertension_level: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.age) { setError(t.addPatient.validation.nameAndAgeRequired); return; }
    setSaving(true);
    try {
      const patient = await createPatient({
        ...form,
        age: parseInt(form.age),
        dementia_stage: form.dementia_stage || undefined,
        hypertension_level: form.hypertension_level || undefined,
      } as any);
      navigate(`/patient/${patient.id}`);
    } catch {
      setError(t.addPatient.error);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6,
    fontSize: 15, outline: 'none',
  };
  const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 4, color: '#2c3e50', fontWeight: 500 };
  const fieldStyle: React.CSSProperties = { marginBottom: 16 };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#2c3e50', marginBottom: 24 }}>{t.addPatient.title}</h1>
      {error && <div style={{ background: '#fadbd8', color: '#c0392b', padding: 12, borderRadius: 6, marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>{t.addPatient.fields.name}</label>
            <input name="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder={t.addPatient.placeholders.name} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>{t.addPatient.fields.age}</label>
            <input name="age" type="number" value={form.age} onChange={handleChange} style={inputStyle} placeholder={t.addPatient.placeholders.age} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>{t.addPatient.fields.gender}</label>
            <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
              <option value="female">{t.addPatient.options.genders.female}</option>
              <option value="male">{t.addPatient.options.genders.male}</option>
              <option value="other">{t.addPatient.options.genders.other}</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>{t.addPatient.fields.phone}</label>
            <input name="phone" value={form.phone} onChange={handleChange} style={inputStyle} placeholder={t.addPatient.placeholders.phone} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>{t.addPatient.fields.dementiaSeverity}</label>
            <select name="dementia_stage" value={form.dementia_stage} onChange={handleChange} style={inputStyle}>
              <option value="">{t.addPatient.options.dementia.none}</option>
              <option value="mild">{t.addPatient.options.dementia.mild}</option>
              <option value="moderate">{t.addPatient.options.dementia.moderate}</option>
              <option value="severe">{t.addPatient.options.dementia.severe}</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>{t.addPatient.fields.hypertensionLevel}</label>
            <select name="hypertension_level" value={form.hypertension_level} onChange={handleChange} style={inputStyle}>
              <option value="">{t.addPatient.options.hypertension.none}</option>
              <option value="stage1">{t.addPatient.options.hypertension.stage1}</option>
              <option value="stage2">{t.addPatient.options.hypertension.stage2}</option>
              <option value="crisis">{t.addPatient.options.hypertension.crisis}</option>
            </select>
          </div>
          <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
            <label style={labelStyle}>{t.addPatient.fields.address}</label>
            <input name="address" value={form.address} onChange={handleChange} style={inputStyle} placeholder={t.addPatient.placeholders.address} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>{t.addPatient.fields.emergencyContact}</label>
            <input name="emergency_contact" value={form.emergency_contact} onChange={handleChange} style={inputStyle} placeholder={t.addPatient.placeholders.emergencyContact} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>{t.addPatient.fields.emergencyPhone}</label>
            <input name="emergency_phone" value={form.emergency_phone} onChange={handleChange} style={inputStyle} placeholder={t.addPatient.placeholders.emergencyPhone} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            type="submit"
            disabled={saving}
            style={{ flex: 1, background: '#1a5276', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 16, cursor: 'pointer' }}
          >
            {saving ? t.addPatient.buttons.saving : t.addPatient.buttons.save}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ flex: 1, background: '#ecf0f1', color: '#2c3e50', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 16, cursor: 'pointer' }}
          >
            {t.addPatient.buttons.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}
