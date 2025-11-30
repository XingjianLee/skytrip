# ⚡ 快速启动指南

## 5 分钟快速启动

### 第一步：检查环境

```powershell
# 检查 Python
python --version

# 检查 Node.js
node --version

# 检查 MySQL（确保服务正在运行）
```

### 第二步：配置环境

```powershell
# 如果还没有 .env 文件，运行配置脚本
python setup_env.py

# 验证配置
python verify_env.py
```

### 第三步：导入数据库

1. 打开 MySQL 客户端（Navicat、MySQL Workbench 等）
2. 创建数据库：`CREATE DATABASE skytrip;`
3. 按顺序导入 `sql/` 目录下的所有 SQL 文件

### 第四步：创建管理员账号

```sql
-- 使用 Python 生成加密密码
-- python -c "from passlib.context import CryptContext; ctx = CryptContext(schemes=['bcrypt']); print(ctx.hash('admin123'))"

-- 插入管理员账号（替换 '加密后的密码' 为上面生成的密码）
INSERT INTO users (username, email, password, real_name, id_card, role) 
VALUES ('admin', 'admin@skytrip.com', '加密后的密码', '管理员', '110101199001011234', 'admin');
```

### 第五步：启动系统

```powershell
# 方式一：一键启动（推荐）
.\start_all.ps1
# 选择选项 3

# 方式二：分别启动
# 终端 1
.\start_backend.ps1

# 终端 2
.\start_frontend.ps1
```

### 第六步：访问系统

1. 打开浏览器：http://localhost:5173
2. 使用管理员账号登录
3. 开始使用！

## 🎯 访问地址

- **前端界面**：http://localhost:5173
- **API 文档**：http://localhost:8000/docs
- **API 地址**：http://localhost:8000/api/v1

## ⚠️ 常见问题

### 端口被占用？

- 后端端口 8000：修改 `main.py` 或关闭占用程序
- 前端端口 5173：修改 `admin-frontend/vite.config.ts`

### 数据库连接失败？

- 检查 MySQL 服务是否运行
- 验证 `.env` 文件中的 `DATABASE_URL`
- 如果密码包含 `@` 等特殊字符，确保已编码

### 前端无法连接后端？

- 确认后端服务正在运行
- 检查 `admin-frontend/.env` 中的 `VITE_API_BASE`

---

**详细文档**：[docs/START_GUIDE.md](docs/START_GUIDE.md)

