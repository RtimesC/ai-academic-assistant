#!/bin/bash

# AI 学术助手 - 启动脚本
# 启动前端和后端服务

echo "🚀 启动 AI 学术助手应用..."
echo ""

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker Desktop"
    exit 1
fi

# 清理旧容器（可选）
# docker-compose down

# 启动 Docker Compose
echo "📦 构建并启动服务..."
docker-compose up

# 应用启动完成
echo ""
echo "✅ 应用启动完成！"
echo "🌐 前端访问地址: http://localhost:3000"
echo "🔌 后端 API 地址: http://localhost:8000"
