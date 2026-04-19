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

    // 模拟获取审计日志
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
        setAuditLogs(data.slice(0, 10)); // 显示最近 10 条
      }
    } catch (err) {
      console.log('Audit logs not available yet');
    }
  };

  const rolePermissions = {
    admin: {
      description: '医疗机构管理员',
      icon: '👨‍💼',
      permissions: [
        '✅ 查看所有患者信息',
        '✅ 管理医生账号',
        '✅ 查看系统统计报告',
        '✅ 管理机构设置',
        '✅ 查看所有操作日志',
        '❌ 不能编辑患者隐私信息'
      ],
      color: '#e74c3c'
    },
    doctor: {
      description: '医生',
      icon: '👨‍⚕️',
      permissions: [
        '✅ 查看自己的患者列表',
        '✅ 录入患者信息',
        '✅ 更新健康数据',
        '✅ 制定护理计划',
        '✅ 开具药物处方',
        '❌ 不能删除患者',
        '❌ 不能查看其他医生的患者'
      ],
      color: '#2980b9'
    },
    patient: {
      description: '患者',
      icon: '👤',
      permissions: [
        '✅ 查看自己的健康数据',
        '✅ 上传体检报告',
        '✅ 查看医生的建议',
        '❌ 不能修改他人信息',
        '❌ 不能查看其他患者数据'
      ],
      color: '#27ae60'
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2c3e50', marginBottom: 24 }}>
        🔐 基于角色的访问控制 (RBAC) 演示
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
            👤 当前登录用户
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: '#7f8c8d' }}>用户名</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{user.username}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#7f8c8d' }}>角色</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {rolePermissions[user.role as keyof typeof rolePermissions]?.icon} {user.role}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#7f8c8d' }}>机构 ID</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{user.organization_id || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}

      {/* 所有角色的权限矩阵 */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#2c3e50', marginBottom: 16 }}>
        📋 权限矩阵
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
              {data.icon} {role.charAt(0).toUpperCase() + role.slice(1)}
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
        🔧 技术实现
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
              🔐 认证机制
            </h3>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.8 }}>
              <p>• JWT Token 令牌认证</p>
              <p>• Token 有效期：8 小时</p>
              <p>• 使用 HS256 加密算法</p>
              <p>• 登录时生成 Token</p>
              <p>• 每个 API 请求都验证 Token</p>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#2c3e50', marginBottom: 12 }}>
              🛡️ 权限检查
            </h3>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.8 }}>
              <p>• 基于角色的访问控制 (RBAC)</p>
              <p>• Token 中包含用户角色信息</p>
              <p>• API 路由可配置所需角色</p>
              <p>• 权限检查失败返回 403 错误</p>
              <p>• 前端路由也进行权限检查</p>
            </div>
          </div>
        </div>
      </div>

      {/* 审计日志示例 */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#2c3e50', marginBottom: 16 }}>
        📝 审计日志示例
      </h2>

      <div style={{
        background: '#fff',
        borderRadius: 10,
        padding: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <p style={{ color: '#7f8c8d', marginBottom: 12, fontSize: 13 }}>
          所有用户操作都会被记录到审计日志中，包括：用户 ID、操作类型、资源、时间、IP 地址等
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
                📋 暂无审计日志 (待后端实现)<br/>
                后续操作会自动记录在数据库中
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 架构图 */}
      <div style={{ marginTop: 32, padding: 20, background: '#f9f9f9', borderRadius: 10 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#2c3e50', marginBottom: 16 }}>
          🏗️ 系统架构流程
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
            1️⃣ 用户访问 /login<br/>
            ↓<br/>
            2️⃣ 输入用户名密码<br/>
            ↓<br/>
            3️⃣ 后端验证密码 (Hash 比对)<br/>
            ↓<br/>
            4️⃣ 生成 JWT Token (包含 user_id, role, exp)<br/>
            ↓<br/>
            5️⃣ 前端保存 Token 到 localStorage<br/>
            ↓<br/>
            6️⃣ 访问受保护页面时，PrivateRoute 检查 Token<br/>
            ↓<br/>
            7️⃣ 如果有角色限制，检查 Token 中的 role<br/>
            ↓<br/>
            8️⃣ 前端 API 请求时，Header 中携带 Token<br/>
            ↓<br/>
            9️⃣ 后端验证 Token 和权限<br/>
            ↓<br/>
            🔟 中间件记录所有操作到审计日志<br/>
          </div>
        </div>
      </div>
    </div>
  );
}
