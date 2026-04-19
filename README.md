# 🏥 AI 护理助手 - 医疗机构管理系统

[English](./README.en.md) | 中文

## 📋 项目概述

**AI 护理助手** 是一个专为医疗机构设计的全栈 AI 驱动的患者护理管理系统。针对痴呆症和高血压患者的综合护理，整合了 AI 推荐、健康监控、药物管理和护理计划功能。具备现代化的科技感界面和企业级的安全认证体系。

### 🎯 核心目标
- 为医疗专业人士提供智能化患者管理工具
- 利用 AI 技术辅助临床决策
- 实现患者数据的安全管理和隐私保护
- 支持多用户角色和权限控制（RBAC）
- 提供现代化、科技感强的用户体验

---

## ✨ 主要特性

### 🔐 认证与权限管理（新增）
- **JWT Token 认证**：8小时有效期，HS256 加密算法
- **三层角色体系**：
  - 👨‍💼 **管理员**：管理医生账号、查看系统日志、机构设置
  - 👨‍⚕️ **医生**：患者管理、数据录入、方案制定
  - 👤 **患者**：查看自己的健康数据（只读权限）
- **前后端双重权限检查**：React 路由保护 + FastAPI 验证
- **审计日志**：所有操作自动记录用户、时间、IP、操作内容

### 📊 患者管理
- ✅ 完整的患者信息录入和编辑
- ✅ 患者分类和筛选（按痴呆程度、高血压级别）
- ✅ 患者列表卡片式展示
- ✅ 患者详情仪表板（风险评分、警报、建议）

### 💊 健康数据监测
- **多维度健康指标**：
  - 血压（收缩压/舒张压）
  - 心率、血糖、体重、体温
  - MMSE 认知评分
- **可视化图表**：Recharts 实时渲染折线图
- **趋势分析**：历史数据对比
- **数据表格**：完整的健康记录查询

### 🤖 AI 推荐引擎
- 风险评估和因素分析
- 个性化护理建议
- 优先级标记（紧急/重要/建议/一般）
- 智能警报系统（关键值提醒）

### 📋 护理计划管理
- 制定和跟踪护理目标
- 记录干预措施
- 进度监控（执行中/已完成/已取消）

### 💊 药物管理
- 药物名称和剂量记录
- 服用频率配置（每日N次、随餐、睡前等）
- 用途和备注
- 用药状态追踪（使用中/已停用）

### 🌍 国际化支持（新增）
- **完整的中英文翻译**
  - 120+ UI 文本字符串
  - 菜单、表单、消息全覆盖
- **一键语言切换**
  - localStorage 持久化
  - 无刷新即时切换

### 🎨 现代化 UI/UX（新增）
- **粒子动画背景**：Canvas 实时渲染蓝紫色粒子群
- **渐变设计**：深空蓝紫色系主题（#0f172a → #1e1b4b）
- **玻璃态界面**：Glassmorphism + Blur 效果
- **Apple 风格按钮**：
  - 4 种变体（Primary/Secondary/Danger/Ghost）
  - 3 种大小（sm/md/lg）
  - 流畅的 Hover/Press 动画（cubic-bezier）
- **响应式布局**：支持各种屏幕尺寸

---

## 🛠 技术栈

### 前端 (Frontend)
```
React 18.2              # UI 框架
TypeScript 4.9          # 类型安全
React Router v6         # 路由管理
Recharts 2.10           # 数据可视化
CSS-in-JS (内联样式)   # 样式方案
Context API             # 状态管理 + i18n
Canvas API              # 粒子动画
```

### 后端 (Backend)
```
Python 3.11             # 编程语言
FastAPI                 # Web 框架
SQLAlchemy              # ORM
SQLite/PostgreSQL       # 数据库
Pydantic                # 数据验证
PyJWT                   # JWT 认证
```

### DevOps
```
Docker & Docker Compose # 容器化
Nginx                   # 反向代理
Let's Encrypt           # HTTPS 证书
```

---

## 🚀 快速开始

### 前置要求
- Docker & Docker Compose（推荐）
- 或者：Python 3.11+ 和 Node.js 18+

### 方式 1：使用 Docker（推荐）

```bash
# 克隆项目
git clone https://github.com/RtimesC/ai-academic-assistant.git
cd ai-academic-assistant

# 启动应用
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止应用
docker-compose down
```

### 方式 2：本地开发

**后端：**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**前端：**
```bash
cd frontend
npm install
npm start
```

### 访问应用

```
🌐 前端: http://localhost:3000
🔌 后端 API: http://localhost:8000
📚 Swagger 文档: http://localhost:8000/docs
🔑 ReDoc 文档: http://localhost:8000/redoc
```

### 测试账户

| 角色 | 用户名 | 密码 | 权限 |
|------|-------|------|------|
| 👨‍💼 管理员 | `admin` | `123456` | 全部 |
| 👨‍⚕️ 医生 | `doctor` | `123456` | 患者管理、数据录入 |
| 👤 患者 | `patient` | `123456` | 只读自己的数据 |

> ⚠️ 注意：测试账户仅供演示，生产环境需要更强的密码策略

---

## 📁 项目结构

```
ai-academic-assistant/
├── frontend/                              # React 前端应用
│   ├── src/
│   │   ├── pages/                        # 页面组件 (6个)
│   │   │   ├── LoginPage.tsx             # 🆕 登录页 (粒子背景)
│   │   │   ├── PatientListPage.tsx       # 患者列表
│   │   │   ├── PatientDetailPage.tsx     # 患者详情 (最复杂, 33个文本)
│   │   │   ├── AddPatientPage.tsx        # 添加患者表单
│   │   │   ├── HealthMonitoringPage.tsx  # 健康监控图表
│   │   │   └── RBACDemoPage.tsx          # 🆕 权限演示页
│   │   ├── components/                   # 公共组件
│   │   │   ├── ParticleBackground.tsx    # 🆕 粒子动画
│   │   │   ├── AppleButton.tsx           # 🆕 Apple 风格按钮
│   │   │   ├── PrivateRoute.tsx          # 🆕 路由保护
│   │   │   ├── AddHealthRecordModal.tsx  # 健康记录弹窗
│   │   │   └── AddMedicationModal.tsx    # 药物弹窗
│   │   ├── i18n/                         # 国际化
│   │   │   ├── translations.ts           # 中英文翻译 (120+)
│   │   │   └── LanguageContext.tsx       # 🆕 语言管理 Context
│   │   ├── utils/
│   │   │   ├── api.ts                    # Axios API 调用
│   │   │   └── types.ts                  # TypeScript 类型定义
│   │   ├── App.tsx                       # 主应用框架 (路由配置)
│   │   └── index.tsx                     # React 入口
│   └── package.json
│
├── backend/                               # Python FastAPI 后端
│   ├── app/
│   │   ├── models/                       # SQLAlchemy ORM 模型
│   │   │   ├── patient.py
│   │   │   ├── health_record.py
│   │   │   ├── medication.py
│   │   │   ├── care_plan.py
│   │   │   ├── user.py                   # 🆕 用户模型
│   │   │   └── audit_log.py              # 🆕 审计日志
│   │   ├── routes/                       # FastAPI 路由
│   │   │   ├── patients.py
│   │   │   ├── health_records.py
│   │   │   ├── medications.py
│   │   │   ├── care_plans.py
│   │   │   ├── ai_recommendations.py
│   │   │   └── auth.py                   # 🆕 JWT 认证路由
│   │   ├── middleware/                   # 🆕 中间件
│   │   │   ├── permissions.py            # 权限检查
│   │   │   └── audit_logging.py          # 日志记录
│   │   ├── schemas/                      # Pydantic 验证模型
│   │   ├── services/                     # 业务逻辑层
│   │   │   └── ai_service.py             # AI 推荐引擎
│   │   ├── database.py                   # SQLAlchemy 配置
│   │   └── main.py                       # FastAPI 应用入口
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml                    # Docker 容器编排
├── README.md                             # 中文文档（你在这里）
├── README.en.md                          # 英文文档
└── .gitignore
```

---

## 🔑 核心功能流程

### 1️⃣ 认证流程
```
输入凭证 → SHA-256 验证密码 → 生成 JWT Token 
→ 保存到 localStorage → 自动跳转首页
```

### 2️⃣ 患者管理流程
```
患者列表 → 添加患者 → 编辑信息 → 患者详情
         └─ 风险评分、警报、建议、药物、护理计划
```

### 3️⃣ 健康监控流程
```
录入健康数据 → Recharts 图表展示 → 趋势分析 
→ 智能预警（关键值）
```

### 4️⃣ 权限控制流程
```
用户登录 → Token 包含 (user_id, role, exp)
→ 前端 PrivateRoute 检查 → API 请求 Header 携带 Token
→ 后端中间件验证 Token → 检查角色权限
→ 审计日志中间件记录操作
```

---

## 🔒 安全特性

### 认证安全
- ✅ JWT Token (HS256 加密)
- ✅ 密码 Hash 存储 (SHA-256)
- ✅ Token 过期机制 (8小时)
- ✅ 登出清除 localStorage

### 授权安全
- ✅ 前端 React 路由检查
- ✅ 后端 API 权限验证
- ✅ 基于角色的访问控制 (RBAC)
- ✅ 角色级别路由保护

### 数据安全
- ✅ 审计日志记录所有操作
- ✅ 操作追踪（用户、时间、IP、详情）
- ✅ 患者数据隔离（医生只能看自己的患者）
- ✅ 只读权限隔离（患者无法修改）

### 传输安全
- ✅ HTTPS 配置（生产环境推荐）
- ✅ CORS 跨域控制
- ✅ Content-Type 验证
- ✅ JWT Token Header 验证

---

## 📊 API 文档

### 完整 API 文档
访问 http://localhost:8000/docs （Swagger UI）或 http://localhost:8000/redoc （ReDoc）

### 认证端点

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "doctor",
  "password": "123456"
}

# 响应
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "doctor",
    "role": "doctor",
    "organization_id": 1
  }
}
```

### 患者端点

```bash
# 获取患者列表
GET /api/patients
Authorization: Bearer {token}

# 添加患者
POST /api/patients
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "李明",
  "age": 65,
  "gender": "male",
  "phone": "13800138000",
  "dementia_stage": "moderate",
  "hypertension_level": "stage2"
}
```

### 主要端点列表

| 方法 | 路径 | 描述 | 需要权限 |
|------|------|------|---------|
| POST | `/api/auth/login` | 用户登录 | - |
| GET | `/api/patients` | 获取患者列表 | doctor, admin |
| POST | `/api/patients` | 添加患者 | doctor, admin |
| GET | `/api/patients/{id}` | 获取患者详情 | doctor, admin |
| GET | `/api/health-records/patient/{id}` | 获取健康记录 | doctor, admin |
| POST | `/api/health-records` | 添加健康记录 | doctor, admin |
| GET | `/api/medications/patient/{id}` | 获取用药列表 | doctor, admin |
| POST | `/api/medications` | 添加药物 | doctor, admin |
| GET | `/api/ai/risk-assessment/{id}` | AI 风险评估 | doctor, admin |
| GET | `/api/ai/alerts/{id}` | 获取健康警报 | doctor, admin |
| GET | `/api/ai/care-recommendations/{id}` | 获取护理建议 | doctor, admin |

---

## 🧪 功能演示

### 角色权限演示
访问 `/rbac-demo` 页面查看：
- 👥 三种角色的权限矩阵（可视化表格）
- 🔧 技术实现细节（JWT、RBAC、中间件）
- 🏗️ 系统架构流程图（完整流程）
- 📝 审计日志示例（操作记录）

### 用户体验演示
1. **不同角色体验** - 用 admin/doctor/patient 账户登录
2. **按钮动画** - Hover/Press 流畅的 Apple 风格交互
3. **语言切换** - 点击导航栏切换中英文，无刷新即时生效
4. **粒子效果** - 登录页后台粒子动画（Canvas 实时渲染）
5. **图表交互** - 健康监控页面 Recharts 动态图表

---

## 🎓 学习价值

这个项目展示了：

✅ **全栈开发**
- React 18 + FastAPI 现代技术栈
- 前后端数据流和通信
- 架构设计模式（MVC, 中间件）

✅ **认证与授权**
- JWT Token 实现原理
- 基于角色的访问控制 (RBAC)
- 中间件设计和使用
- 前后端权限同步

✅ **UI/UX 设计**
- 现代化界面设计（深空蓝紫）
- Canvas 动画实现
- Apple 风格交互设计
- Glassmorphism 设计模式

✅ **国际化（i18n）**
- React Context API 管理全局状态
- 多语言翻译系统
- localStorage 持久化存储
- 一键语言切换

✅ **医疗信息系统**
- 患者数据管理（CRUD）
- 健康指标多维度监控
- AI 辅助决策系统
- 风险评估和警报机制

---

## 📈 项目统计

| 指标 | 数据 |
|------|------|
| 前端文件 | 13 个 |
| 后端文件 | 15+ 个 |
| 代码行数 | ~5000+ |
| UI 翻译文本 | 120+ 条 |
| React 组件 | 13 个 |
| API 端点 | 20+ 个 |
| 数据库表 | 8 个 |
| 演示账户 | 3 个 |

---

## 🔄 开发工作流

### 本地开发

```bash
# 1. 启动 Docker 容器
docker-compose up -d

# 2. 前端开发（热重载）
cd frontend && npm start
# 访问 http://localhost:3000

# 3. 后端开发（自动重载）
cd backend && uvicorn app.main:app --reload
# 访问 http://localhost:8000/docs

# 4. 查看改动
git status
git diff

# 5. 提交代码
git add .
git commit -m "feat: add new feature"
git push origin main
```

### 部署到生产环境

1. **购买服务器**（阿里云、腾讯云、AWS 等）
2. **申请域名和 HTTPS 证书**
3. **配置环境变量** (SECRET_KEY、数据库链接)
4. **使用 Docker Compose 部署**
5. **配置 Nginx 反向代理**
6. **设置定期数据库备份**

---

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📞 联系方式

- 📧 Email: your-email@example.com
- 🐙 GitHub: https://github.com/RtimesC/ai-academic-assistant
- 💬 Issues: 报告 Bug 或建议新功能

---

## 📄 许可证

此项目采用 **MIT 许可证**。详见 [LICENSE](./LICENSE) 文件。

---

## ⭐ 致谢

感谢所有贡献者和使用者的支持！

- React 社区和官方文档
- FastAPI 开发团队
- Recharts 图表库
- 医疗行业专业人士的建议反馈

---

## 📚 相关资源

- 📖 [React 官方文档](https://react.dev)
- 📖 [FastAPI 官方文档](https://fastapi.tiangolo.com)
- 📖 [JWT 认证详解](https://jwt.io)
- 📖 [RBAC 设计模式](https://en.wikipedia.org/wiki/Role-based_access_control)
- 📖 [Docker Compose 文档](https://docs.docker.com/compose)

---

## 🔗 相关链接

- 💻 源代码: https://github.com/RtimesC/ai-academic-assistant
- 🐛 提交 Bug: https://github.com/RtimesC/ai-academic-assistant/issues
- 🌟 Stars: https://github.com/RtimesC/ai-academic-assistant/stargazers

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**

---

更新于：2024年04月19日 | 版本：2.0.0 (含认证、RBAC、粒子特效、国际化)
