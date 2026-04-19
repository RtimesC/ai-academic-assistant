import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function RBACDemoPage() {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:8000/api/audit-logs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.slice(0, 10));
      }
    } catch (err) {
      console.log('Audit logs not available yet');
    }
  };

  const rolePermissions = {
    admin: {
      ...t.rbacDemo.roles.admin,
      color: '#e74c3c'
    },
    doctor: {
      ...t.rbacDemo.roles.doctor,
      color: '#2980b9'
    },
    patient: {
      ...t.rbacDemo.roles.patient,
      color: '#27ae60'
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2c3e50', marginBottom: 24 }}>
        {t.rbacDemo.title}
      </h1>

      {/* 当前用户信息 */}
      {user && (
        <div style={{
          background: '#ecf0f1',
          borderRadius: 10,
          padding: 16,
          marginBottom: 24,
          border: `2px solid ${rolePermissions[user.role as keyof typeof rolePermissions]?.color || '#95a5a6'}`
        }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#2c3e50', marginBottom: 8 }}>
            {t.rbacDemo.currentUser}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: '#7f8c8d' }}>{t.rbacDemo.username}</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{user.username}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#7f8c8d' }}>{t.rbacDemo.role}</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {rolePermissions[user.role as keyof typeof rolePermissions]?.icon} {user.role}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#7f8c8d' }}>{t.rbacDemo.organizationId}</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{user.organization_id || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}

      {/* 所有角色的权限矩阵 */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#2c3e50', marginBottom: 16 }}>
        {t.rbacDemo.permissionMatrix}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 16, marginBottom: 32 }}>
        {Object.entries(rolePermissions).map(([role, data]: [string, any]) => (
          <div
            key={role}
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderTop: `4px solid ${data.color}`
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
              {data.icon} {data.title.charAt(0).toUpperCase() + data.title.slice(1)}
            </div>
            <div style={{ fontSize: 13, color: '#7f8c8d', marginBottom: 16 }}>
              {data.description}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.permissions.map((perm: string, idx: number) => (
                <div key={idx} style={{ fontSize: 13, color: perm.startsWith('✅') ? '#27ae60' : '#e74c3c' }}>
                  {perm}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 技术实现细节 */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#2c3e50', marginBottom: 16 }}>
        {t.rbacDemo.technicalImpl}
      </h2>

      <div style={{
        background: '#fff',
        borderRadius: 10,
        padding: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: 24
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#2c3e50', marginBottom: 12 }}>
              {t.rbacDemo.authentication}
            </h3>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.8 }}>
              {t.rbacDemo.authDetails.map((detail: string, idx: number) => (
                <p key={idx}>{detail}</p>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#2c3e50', marginBottom: 12 }}>
              {t.rbacDemo.permissionCheck}
            </h3>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.8 }}>
              {t.rbacDemo.permCheckDetails.map((detail: string, idx: number) => (
                <p key={idx}>{detail}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 审计日志示例 */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#2c3e50', marginBottom: 16 }}>
        {t.rbacDemo.auditLogs}
      </h2>

      <div style={{
        background: '#fff',
        borderRadius: 10,
        padding: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <p style={{ color: '#7f8c8d', marginBottom: 12, fontSize: 13 }}>
          {t.rbacDemo.auditDescription}
        </p>
        <div style={{ background: '#f4f6f8', borderRadius: 6, padding: 12, fontSize: 12, fontFamily: 'monospace', color: '#2c3e50', maxHeight: 200, overflowY: 'auto' }}>
          <div>
            {auditLogs.length > 0 ? (
              auditLogs.map((log: any, idx: number) => (
                <div key={idx} style={{ marginBottom: 8, borderBottom: '1px solid #ddd', paddingBottom: 8 }}>
                  <strong>{log.action}</strong> on {log.resource_type}:{log.resource_id}<br/>
                  User: {log.user_id} | IP: {log.ip_address} | {log.timestamp}
                </div>
              ))
            ) : (
              <div style={{ color: '#7f8c8d' }}>
                {t.rbacDemo.noAuditLogs}<br/>
                {t.rbacDemo.auditLogsNote}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 架构图 */}
      <div style={{ marginTop: 32, padding: 20, background: '#f9f9f9', borderRadius: 10 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#2c3e50', marginBottom: 16 }}>
          {t.rbacDemo.architecture}
        </h3>
        <div style={{
          background: '#fff',
          borderRadius: 6,
          padding: 16,
          fontSize: 12,
          fontFamily: 'monospace',
          color: '#2c3e50',
          lineHeight: 1.8
        }}>
          <div>
            {t.rbacDemo.architectureFlow.map((line: string, idx: number) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
