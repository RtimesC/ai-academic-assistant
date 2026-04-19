import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import ParticleBackground from '../components/ParticleBackground';
import AppleButton from '../components/AppleButton';

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        throw new Error('Login failed');
      }

      const data = await res.json();
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/');
    } catch (err) {
      setError(t.login.loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* 粒子背景 */}
      <ParticleBackground />

      {/* 主卡片 */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: 20,
          padding: 40,
          width: 380,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* 背景光晕效果 */}
        <div
          style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            background: 'radial-gradient(circle, rgba(118, 75, 162, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
        />

        <h1
          style={{
            textAlign: 'center',
            marginBottom: 8,
            color: '#fff',
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: '-0.5px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {t.login.title}
        </h1>
        <p
          style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: 32,
            fontSize: 14,
            fontWeight: 500,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {t.login.subtitle}
        </p>

        {error && (
          <div
            style={{
              background: 'rgba(245, 87, 108, 0.1)',
              color: '#f5576c',
              padding: 12,
              borderRadius: 10,
              marginBottom: 16,
              fontSize: 14,
              border: '1px solid rgba(245, 87, 108, 0.3)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                marginBottom: 8,
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {t.login.username}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.login.usernamePlaceholder}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 10,
                fontSize: 15,
                boxSizing: 'border-box',
                color: '#fff',
                transition: 'all 0.3s ease',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.border = '1px solid rgba(102, 126, 234, 0.5)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(102, 126, 234, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: 'block',
                marginBottom: 8,
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {t.login.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.login.passwordPlaceholder}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 10,
                fontSize: 15,
                boxSizing: 'border-box',
                color: '#fff',
                transition: 'all 0.3s ease',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.border = '1px solid rgba(102, 126, 234, 0.5)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(102, 126, 234, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <AppleButton
            type="submit"
            disabled={loading}
            size="lg"
            style={{ width: '100%' }}
          >
            {loading ? t.login.loginLoading : t.login.loginButton}
          </AppleButton>
        </form>

        {/* 测试账户信息 */}
        <div
          style={{
            marginTop: 24,
            padding: 14,
            background: 'rgba(102, 126, 234, 0.05)',
            borderRadius: 10,
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.7)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <p style={{ margin: '0 0 8px 0', fontWeight: 700, color: '#667eea' }}>
            {t.login.testAccounts}
          </p>
          <p style={{ margin: '6px 0' }}>👨‍⚕️ doctor / 123456</p>
          <p style={{ margin: '6px 0' }}>👤 admin / 123456</p>
          <p style={{ margin: '6px 0' }}>🏥 patient / 123456</p>
        </div>
      </div>
    </div>
  );
}
