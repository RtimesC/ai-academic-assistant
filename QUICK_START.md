# 🚀 项目启动指南

## 第一步：环境准备（网络通行证）

每次打开新的终端窗口时，为了防止拉取环境或调用外部接口失败，先声明代理（**确保代理软件已开启"允许局域网连接"**）：

```bash
export HTTP_PROXY="http://192.168.1.109:7890"
export HTTPS_PROXY="http://192.168.1.109:7890"
```

> **⚠️ 注意：** 如果你的局域网 IP 变了，记得替换上面的数字

---

## 第二步：一键启动项目

在终端中，确保你处于项目文件夹目录下（即包含 `docker-compose.yml` 的目录），执行：

```bash
docker compose up -d
```

> **说明：** 加上 `-d` 表示在后台运行，这样你的终端还能继续敲其他命令

---

## 第三步：检查与使用

### ✅ 确认是否成功运行

```bash
docker ps
```

看到 `frontend` 和 `backend` 的状态都是 `Up` 即可！

### 🌐 在浏览器中访问

| 应用 | 地址 |
|------|------|
| 🖥️ 前端页面 (用户界面) | http://localhost:3000 |
| ⚙️ 后端接口文档 (Swagger UI) | http://localhost:8000/docs |

---

## 第四步：日常调试（查看日志）

如果代码报错或者页面没反应，想看看后台输出：

```bash
# 查看所有容器的实时滚动日志
docker compose logs -f

# 如果只想看后端的日志
docker compose logs -f backend

# 如果只想看前端的日志
docker compose logs -f frontend
```

> **按 `Ctrl + C` 退出日志查看**

---

## 第五步：结束一天的工作（停止运行）

不想开发了，或者准备关机前，释放电脑资源：

```bash
# 彻底关闭并移除临时网络（推荐）
docker compose down

# 或者：仅仅暂停它们（保留当前状态）
docker compose stop
```

---

## 📝 配置文件说明

该项目已进行以下优化：

- **`.env.local`** - 前端开发环境变量，跳过预检查和优化启动速度
- **`.npmrc`** - npm 配置文件，优化安装速度和兼容性
- **`.dockerignore`** - Docker 构建忽略文件，减少镜像体积
- **`STARTUP_GUIDE.md`** - 详细的启动和排查指南

---

## 🆘 故障排除

### 问题：Docker 容器无法启动

**检查 Docker 是否运行：**
```bash
docker ps
```

### 问题：无法访问 localhost:3000

1. **检查容器是否成功启动：**
   ```bash
   docker-compose ps
   ```

2. **查看容器日志：**
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```

3. **重启容器：**
   ```bash
   docker-compose restart
   ```

4. **完全重建：**
   ```bash
   docker-compose down
   docker-compose up --build -d
   ```

### 问题：端口被占用

```bash
# 检查端口占用（Windows）
netstat -ano | findstr :3000

# 检查端口占用（Mac/Linux）
lsof -i :3000
```

如果端口被占用，修改 `docker-compose.yml` 中的端口配置后重启。

---

## 💡 小贴士

- **首次启动较慢：** Docker 容器中的 npm install 会耗时 3-5 分钟，这是正常的，建议在后台运行
- **跳过代理：** 如果你在公司网络内不需要代理，可以跳过第一步
- **快速开发：** 可以直接在本地开发（不使用 Docker），详见 `STARTUP_GUIDE.md`

更多详细信息，请查看 `STARTUP_GUIDE.md`！
