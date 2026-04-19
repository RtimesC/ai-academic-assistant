import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export default function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user');

  // 如果没有 token，重定向到登录页
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 如果需要特定角色，检查用户角色
  if (requiredRole && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (!requiredRole.includes(user.role)) {
        return (
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c0392b',
            fontSize: 18
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
              <div>权限不足，无法访问该页面</div>
              <div style={{ fontSize: 14, color: '#7f8c8d', marginTop: 8 }}>
                当前角色: {user.role}
              </div>
            </div>
          </div>
        );
      }
    } catch (e) {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
