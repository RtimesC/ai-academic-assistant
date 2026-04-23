# AI Academic Assistant

## English

### 1) Project Overview
AI Academic Assistant is a full-stack AI-enabled assistant platform. The current implementation is focused on healthcare management workflows, with:
- Frontend: React + TypeScript
- Backend: FastAPI + SQLAlchemy
- Deployment: Docker Compose for one-command local startup

The backend API is currently named **AI Care Assistant API**, and includes authentication, RBAC, and audit logging support.

### 2) Core Capabilities
- JWT-based login and token verification
- Role-based access control (admin / doctor / patient)
- Patient management
- Health record management
- Medication management
- Care plan management
- AI recommendation endpoint
- Bilingual UI switching (English/Chinese)

### 3) Tech Stack and Framework
#### Frontend
- React 18
- TypeScript
- React Router v6
- Axios
- Recharts
- react-scripts (CRA)

#### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- python-jose (JWT)
- passlib

#### Runtime / Infra
- Docker Compose
- Node 18 (frontend container)
- Python backend container with mounted source volume

### 4) Repository Structure
```text
.
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py          # App entry, route registration, middleware
│   │   ├── routes/          # API routes
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── middleware/      # Permission + audit middleware
│   │   └── services/        # AI service layer
│   └── requirements.txt
├── frontend/                # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/           # Main pages
│   │   ├── components/      # Reusable components
│   │   ├── i18n/            # Language context and translations
│   │   └── utils/           # API/types helpers
├── docker-compose.yml
├── QUICK_START.md
└── STARTUP_GUIDE.md
```

### 5) Quick Start (Docker Recommended)
#### Prerequisites
- Docker + Docker Compose

#### Start services
```bash
docker compose up -d
```

#### Access URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs

#### View logs
```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
```

#### Stop services
```bash
docker compose down
```

### 6) Local Development (Without Docker)
#### Frontend
```bash
cd frontend
npm install
npm start
```

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 7) Default Demo Accounts
- admin / 123456
- doctor / 123456
- patient / 123456

> ⚠️ For development/demo only. Change or disable these default accounts before any production deployment.

### 8) Available Frontend Commands
```bash
cd frontend
npm start
npm run build
npm test
```

### 9) Additional Documentation
This repository also includes:
- `QUICK_START.md` (quick startup notes)
- `STARTUP_GUIDE.md` (detailed startup and troubleshooting guide)
- `docs/README.md` (startup and operations notes)

---

## 中文

### 1）项目概述
AI Academic Assistant 是一个全栈 AI 辅助平台。当前实现主要聚焦于医疗照护管理场景，主要由以下部分构成：
- 前端：React + TypeScript
- 后端：FastAPI + SQLAlchemy
- 部署：使用 Docker Compose 一键本地启动

当前后端 API 标题为 **AI Care Assistant API**，已集成认证、RBAC 权限与审计日志能力。

### 2）核心能力
- 基于 JWT 的登录与令牌校验
- 基于角色的访问控制（admin / doctor / patient）
- 患者信息管理
- 健康记录管理
- 用药信息管理
- 护理计划管理
- AI 推荐接口
- 前端中英文切换

### 3）技术栈与项目框架
#### 前端
- React 18
- TypeScript
- React Router v6
- Axios
- Recharts
- react-scripts（CRA）

#### 后端
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- python-jose（JWT）
- passlib

#### 运行与基础设施
- Docker Compose
- Node 18（前端容器）
- Python 后端容器（挂载源码目录）

### 4）仓库结构
```text
.
├── backend/                 # FastAPI 后端
│   ├── app/
│   │   ├── main.py          # 应用入口、路由注册、中间件
│   │   ├── routes/          # API 路由
│   │   ├── models/          # SQLAlchemy 模型
│   │   ├── schemas/         # Pydantic 数据模型
│   │   ├── middleware/      # 权限与审计中间件
│   │   └── services/        # AI 服务层
│   └── requirements.txt
├── frontend/                # React + TypeScript 前端
│   ├── src/
│   │   ├── pages/           # 页面
│   │   ├── components/      # 通用组件
│   │   ├── i18n/            # 多语言上下文与翻译
│   │   └── utils/           # API 与类型工具
├── docker-compose.yml
├── QUICK_START.md
└── STARTUP_GUIDE.md
```

### 5）快速启动（推荐 Docker）
#### 前置要求
- Docker + Docker Compose

#### 启动服务
```bash
docker compose up -d
```

#### 访问地址
- 前端页面：http://localhost:3000
- 后端 API：http://localhost:8000
- Swagger 文档：http://localhost:8000/docs

#### 查看日志
```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
```

#### 停止服务
```bash
docker compose down
```

### 6）本地开发（不使用 Docker）
#### 前端
```bash
cd frontend
npm install
npm start
```

#### 后端
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 7）默认演示账号
- admin / 123456
- doctor / 123456
- patient / 123456

> ⚠️ 仅用于开发/演示环境。任何生产部署前请务必修改或禁用这些默认账号。

### 8）前端常用命令
```bash
cd frontend
npm start
npm run build
npm test
```

### 9）补充文档
仓库中还包含以下文档：
- `QUICK_START.md`（快速启动说明）
- `STARTUP_GUIDE.md`（详细启动与排障指南）
- `docs/README.md`（启动与运行说明）

## License / 许可证
MIT License
