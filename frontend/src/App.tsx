import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from './i18n/LanguageContext';
import PrivateRoute from './components/PrivateRoute';
import ParticleBackground from './components/ParticleBackground';
import AppleButton from './components/AppleButton';
import LoginPage from './pages/LoginPage';
import PatientListPage from './pages/PatientListPage';
import PatientDetailPage from './pages/PatientDetailPage';
import AddPatientPage from './pages/AddPatientPage';
import HealthMonitoringPage from './pages/HealthMonitoringPage';
import RBACDemoPage from './pages/RBACDemoPage';

const navStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 27, 75, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  color: '#fff',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 60,
  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
};

const navLeftStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 32,
};

const linkStyle = (isActive: boolean): React.CSSProperties => ({
  color: isActive ? '#667eea' : 'rgba(255, 255, 255, 0.7)',
  textDecoration: 'none',
  fontWeight: isActive ? 700 : 500,
  fontSize: 15,
  borderBottom: isActive ? '2px solid #667eea' : '2px solid transparent',
  paddingBottom: 4,
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
});

const langButtonStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#fff',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  padding: '8px 14px',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 600,
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  backdropFilter: 'blur(10px)',
};

const langButtonHoverStyle: React.CSSProperties = {
  ...langButtonStyle,
  background: 'rgba(255, 255, 255, 0.12)',
};

export default function App() {
  const { t, language, toggleLanguage } = useLanguage();
  const [langButtonHovered, setLangButtonHovered] = React.useState(false);
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
        {/* 粒子背景 */}
        <ParticleBackground />

        <nav style={navStyle}>
          <div style={navLeftStyle}>
            <span style={{
              fontWeight: 700,
              fontSize: 20,
              marginRight: 16,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              🏥 AI 护理助手
            </span>
            <NavLink to="/" style={({ isActive }) => linkStyle(isActive)} end>患者列表</NavLink>
            <NavLink to="/add-patient" style={({ isActive }) => linkStyle(isActive)}>添加患者</NavLink>
            <NavLink to="/rbac-demo" style={({ isActive }) => linkStyle(isActive)}>🔐 RBAC Demo</NavLink>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user && (
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 13, fontWeight: 500 }}>
                👤 {user.username} ({user.role})
              </div>
            )}
            <button
              onClick={toggleLanguage}
              onMouseEnter={() => setLangButtonHovered(true)}
              onMouseLeave={() => setLangButtonHovered(false)}
              style={langButtonHovered ? langButtonHoverStyle : langButtonStyle}
            >
              {language === 'zh' ? '中文' : 'EN'} | {language === 'zh' ? 'EN' : '中文'}
            </button>
            <AppleButton
              onClick={handleLogout}
              variant="danger"
              size="sm"
            >
              登出
            </AppleButton>
          </div>
        </nav>
        <main style={{ padding: 24, maxWidth: 1400, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <PrivateRoute requiredRole={['doctor', 'admin']}>
                <PatientListPage />
              </PrivateRoute>
            } />
            <Route path="/add-patient" element={
              <PrivateRoute requiredRole={['doctor', 'admin']}>
                <AddPatientPage />
              </PrivateRoute>
            } />
            <Route path="/patient/:id" element={
              <PrivateRoute requiredRole={['doctor', 'admin', 'patient']}>
                <PatientDetailPage />
              </PrivateRoute>
            } />
            <Route path="/patient/:id/health" element={
              <PrivateRoute requiredRole={['doctor', 'admin', 'patient']}>
                <HealthMonitoringPage />
              </PrivateRoute>
            } />
            <Route path="/rbac-demo" element={
              <PrivateRoute requiredRole={['doctor', 'admin', 'patient']}>
                <RBACDemoPage />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
