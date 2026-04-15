import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPatient } from '../utils/api';

export default function AddPatientPage() {
  const navigate = useNavigate();
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
    if (!form.name || !form.age) { setError('请填写姓名和年龄'); return; }
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
      setError('保存失败，请重试');
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
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#2c3e50', marginBottom: 24 }}>添加新患者</h1>
      {error && <div style={{ background: '#fadbd8', color: '#c0392b', padding: 12, borderRadius: 6, marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>姓名 *</label>
            <input name="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder="请输入姓名" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>年龄 *</label>
            <input name="age" type="number" value={form.age} onChange={handleChange} style={inputStyle} placeholder="请输入年龄" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>性别</label>
            <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
              <option value="female">女</option>
              <option value="male">男</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>联系电话</label>
            <input name="phone" value={form.phone} onChange={handleChange} style={inputStyle} placeholder="请输入联系电话" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>痴呆程度</label>
            <select name="dementia_stage" value={form.dementia_stage} onChange={handleChange} style={inputStyle}>
              <option value="">无痴呆</option>
              <option value="mild">轻度</option>
              <option value="moderate">中度</option>
              <option value="severe">重度</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>高血压级别</label>
            <select name="hypertension_level" value={form.hypertension_level} onChange={handleChange} style={inputStyle}>
              <option value="">无高血压</option>
              <option value="stage1">1期</option>
              <option value="stage2">2期</option>
              <option value="crisis">危象</option>
            </select>
          </div>
          <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
            <label style={labelStyle}>地址</label>
            <input name="address" value={form.address} onChange={handleChange} style={inputStyle} placeholder="请输入居住地址" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>紧急联系人</label>
            <input name="emergency_contact" value={form.emergency_contact} onChange={handleChange} style={inputStyle} placeholder="紧急联系人姓名" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>紧急联系电话</label>
            <input name="emergency_phone" value={form.emergency_phone} onChange={handleChange} style={inputStyle} placeholder="紧急联系人电话" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            type="submit"
            disabled={saving}
            style={{ flex: 1, background: '#1a5276', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 16, cursor: 'pointer' }}
          >
            {saving ? '保存中...' : '保存患者'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ flex: 1, background: '#ecf0f1', color: '#2c3e50', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 16, cursor: 'pointer' }}
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
