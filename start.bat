@echo off
REM AI 学术助手 - Windows 启动脚本

echo.
echo 🚀 启动 AI 学术助手应用...
echo.

REM 检查 Docker 是否运行
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker 未运行，请先启动 Docker Desktop
    pause
    exit /b 1
)

REM 启动 Docker Compose
echo 📦 构建并启动服务...
docker-compose up

REM 应用启动完成
echo.
echo ✅ 应用启动完成！
echo 🌐 前端访问地址: http://localhost:3000
echo 🔌 后端 API 地址: http://localhost:8000
echo.
pause
