import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useLanguage } from './i18n/LanguageContext';
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
  justifyContent: 'space-between',
  height: 56,
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
};

const navLeftStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 32,
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

const langButtonStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.15)',
  color: '#ecf0f1',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  padding: '6px 12px',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 13,
  transition: 'all 0.2s',
  fontWeight: 500,
};

const langButtonHoverStyle: React.CSSProperties = {
  ...langButtonStyle,
  background: 'rgba(255, 255, 255, 0.25)',
};

export default function App() {
  const { t, language, toggleLanguage } = useLanguage();
  const [langButtonHovered, setLangButtonHovered] = React.useState(false);

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#f4f6f8' }}>
        <nav style={navStyle}>
          <div style={navLeftStyle}>
            <span style={{ fontWeight: 700, fontSize: 18, marginRight: 16 }}>{t.nav.title}</span>
            <NavLink to="/" style={({ isActive }) => linkStyle(isActive)} end>{t.nav.patientList}</NavLink>
            <NavLink to="/add-patient" style={({ isActive }) => linkStyle(isActive)}>{t.nav.addPatient}</NavLink>
          </div>
          <button
            onClick={toggleLanguage}
            onMouseEnter={() => setLangButtonHovered(true)}
            onMouseLeave={() => setLangButtonHovered(false)}
            style={langButtonHovered ? langButtonHoverStyle : langButtonStyle}
          >
            {language === 'zh' ? '中文' : 'English'} | {language === 'zh' ? 'English' : '中文'}
          </button>
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
