import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import PatientListPage from './pages/PatientListPage';
import PatientDetailPage from './pages/PatientDetailPage';
import AddPatientPage from './pages/AddPatientPage';
import HealthMonitoringPage from './pages/HealthMonitoringPage';

const navStyle: React.CSSProperties = {
  background: '#1a5276',
  color: '#fff',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  gap: 32,
  height: 56,
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
};

const linkStyle = (isActive: boolean): React.CSSProperties => ({
  color: isActive ? '#aed6f1' : '#ecf0f1',
  textDecoration: 'none',
  fontWeight: isActive ? 700 : 400,
  fontSize: 15,
  borderBottom: isActive ? '2px solid #aed6f1' : '2px solid transparent',
  paddingBottom: 4,
  transition: 'all 0.2s',
});

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#f4f6f8' }}>
        <nav style={navStyle}>
          <span style={{ fontWeight: 700, fontSize: 18, marginRight: 16 }}>🏥 AI 护理助手</span>
          <NavLink to="/" style={({ isActive }) => linkStyle(isActive)} end>患者列表</NavLink>
          <NavLink to="/add-patient" style={({ isActive }) => linkStyle(isActive)}>添加患者</NavLink>
        </nav>
        <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<PatientListPage />} />
            <Route path="/add-patient" element={<AddPatientPage />} />
            <Route path="/patient/:id" element={<PatientDetailPage />} />
            <Route path="/patient/:id/health" element={<HealthMonitoringPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
