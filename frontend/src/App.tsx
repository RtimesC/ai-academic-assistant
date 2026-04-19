import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from './i18n/LanguageContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import PatientListPage from './pages/PatientListPage';
import PatientDetailPage from './pages/PatientDetailPage';
import AddPatientPage from './pages/AddPatientPage';
import HealthMonitoringPage from './pages/HealthMonitoringPage';
import RBACDemoPage from './pages/RBACDemoPage';

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

  // 如果未登录，只显示登录页
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#f4f6f8' }}>
        <nav style={navStyle}>
          <div style={navLeftStyle}>
            <span style={{ fontWeight: 700, fontSize: 18, marginRight: 16 }}>{t.nav.title}</span>
            <NavLink to="/" style={({ isActive }) => linkStyle(isActive)} end>{t.nav.patientList}</NavLink>
            <NavLink to="/add-patient" style={({ isActive }) => linkStyle(isActive)}>{t.nav.addPatient}</NavLink>
            <NavLink to="/rbac-demo" style={({ isActive }) => linkStyle(isActive)}>🔐 RBAC Demo</NavLink>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* 用户信息显示 */}
            <div style={{ color: '#ecf0f1', fontSize: 13 }}>
              {user && `👤 ${user.username} (${user.role})`}
            </div>
            {/* 语言切换 */}
            <button
              onClick={toggleLanguage}
              onMouseEnter={() => setLangButtonHovered(true)}
              onMouseLeave={() => setLangButtonHovered(false)}
              style={langButtonHovered ? langButtonHoverStyle : langButtonStyle}
            >
              {language === 'zh' ? '中文' : 'English'} | {language === 'zh' ? 'English' : '中文'}
            </button>
            {/* 登出 */}
            <button
              onClick={handleLogout}
              style={{
                ...langButtonStyle,
                background: 'rgba(231, 76, 60, 0.2)',
                color: '#e74c3c'
              }}
            >
              登出
            </button>
          </div>
        </nav>
        <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
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
