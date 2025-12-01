# SkyTrip 管理员端系统启动完整指南

## 📋 前置要求

在启动系统之前，请确保已安装以下软件：

### 必需软件

1. **Python 3.8+**
   - 下载地址：https://www.python.org/downloads/
   - 安装时勾选 "Add Python to PATH"

2. **Node.js 18+ 和 npm**
   - 下载地址：https://nodejs.org/
   - 安装 Node.js 会自动包含 npm

3. **MySQL 8.0+**
   - 下载地址：https://dev.mysql.com/downloads/mysql/
   - 确保 MySQL 服务正在运行

### 数据库准备

1. **创建数据库**
   ```sql
   CREATE DATABASE IF NOT EXISTS skytrip CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **导入 SQL 文件**
   
   按顺序执行 `sql/` 目录下的所有 SQL 文件：
   - `airlines.sql`
   - `airports.sql`
   - `routes.sql`
   - `flights.sql`
   - `flight_pricing.sql`
   - `users.sql`
   - `passengers.sql`
   - `orders.sql`
   - `order_items.sql`
   - `check_ins.sql`
   - `agencies.sql`
   - `admin_extension.sql`

3. **创建管理员账号**
   
   在数据库中插入管理员账号（密码需要先加密）：
   ```sql
   -- 使用 Python 生成加密密码
   python -c "from passlib.context import CryptContext; ctx = CryptContext(schemes=['bcrypt']); print(ctx.hash('your_password'))"
   
   -- 然后插入数据库
   INSERT INTO users (username, email, password, real_name, id_card, role) 
   VALUES ('admin', 'admin@skytrip.com', '加密后的密码', '管理员', '110101199001011234', 'admin');
   ```

## 🚀 快速启动（推荐）

### 方式一：使用启动脚本（Windows）

1. **一键启动所有服务**
   ```powershell
   .\start_all.ps1
   ```
   选择选项 3，系统会自动打开两个窗口分别运行后端和前端。

2. **分别启动服务**
   ```powershell
   # 启动后端（在一个终端）
   .\start_backend.ps1
   
   # 启动前端（在另一个终端）
   .\start_frontend.ps1
   ```

### 方式二：手动启动

#### 步骤 1：配置环境变量

确保 `.env` 文件已创建并配置正确：

```bash
# 如果还没有 .env 文件，运行配置脚本
python setup_env.py

# 验证配置
python verify_env.py
```

#### 步骤 2：安装后端依赖

```bash
# 创建虚拟环境（可选但推荐）
python -m venv venv

# 激活虚拟环境
# Windows:
.\venv\Scripts\Activate.ps1
# Linux/Mac:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

#### 步骤 3：启动后端服务

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

后端服务启动后：
- ✅ API 文档：http://localhost:8000/docs
- ✅ API 地址：http://localhost:8000/api/v1
- ✅ 健康检查：http://localhost:8000/docs

#### 步骤 4：安装前端依赖

打开**新的终端窗口**，进入前端目录：

```bash
cd admin-frontend

# 安装依赖
npm install
# 或使用
pnpm install
```

#### 步骤 5：配置前端环境变量（可选）

创建 `admin-frontend/.env` 文件（如果后端不在 localhost:8000）：

```env
VITE_API_BASE=http://localhost:8000
```

#### 步骤 6：启动前端服务

```bash
npm run dev
```

前端服务启动后：
- ✅ 前端界面：http://localhost:5173
- ✅ 自动打开浏览器（如果配置了）

## 📱 访问系统

### 登录系统

1. 打开浏览器访问：http://localhost:5173
2. 使用管理员账号登录：
   - 用户名：你在数据库中创建的管理员用户名
   - 密码：创建账号时设置的密码

### 系统功能

登录成功后，你可以使用以下功能：

- **航班管理**：查看、添加、编辑、删除航班信息
- **酒店管理**：管理酒店资源
- **景点管理**：管理景点信息
- **用户管理**：查看用户列表、冻结/解冻用户
- **订单管理**：查看订单、修改订单状态
- **通知管理**：发送系统通知
- **财务报表**：查看收入、订单等统计数据

## 🔧 常见问题排查

### 1. 后端启动失败

**问题：数据库连接失败**
```
解决方案：
- 检查 MySQL 服务是否运行
- 验证 .env 文件中的 DATABASE_URL 是否正确
- 确认数据库 skytrip 已创建
- 如果密码包含特殊字符，确保已进行 URL 编码
```

**问题：端口被占用**
```
解决方案：
- 修改 main.py 中的端口号
- 或关闭占用 8000 端口的程序
- Windows 查看端口占用：netstat -ano | findstr :8000
```

**问题：依赖安装失败**
```
解决方案：
- 升级 pip：python -m pip install --upgrade pip
- 使用国内镜像：pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 2. 前端启动失败

**问题：npm install 失败**
```
解决方案：
- 清除缓存：npm cache clean --force
- 删除 node_modules 和 package-lock.json 后重新安装
- 使用国内镜像：npm config set registry https://registry.npmmirror.com
```

**问题：无法连接后端 API**
```
解决方案：
- 确认后端服务正在运行
- 检查 admin-frontend/.env 中的 VITE_API_BASE 配置
- 查看浏览器控制台的错误信息
- 检查 CORS 设置（后端已配置允许跨域）
```

### 3. 登录失败

**问题：账号不存在或无权限**
```
解决方案：
- 确认数据库中已创建管理员账号
- 检查用户的 role 字段是否为 'admin'
- 验证用户名和密码是否正确
```

**问题：JWT Token 错误**
```
解决方案：
- 检查 .env 文件中的 SECRET_KEY 是否正确
- 清除浏览器缓存和 Cookie
- 重新登录
```

## 📊 系统架构

```
┌─────────────────┐
│   前端 (Vue 3)   │  http://localhost:5173
│  admin-frontend  │
└────────┬─────────┘
         │ HTTP/HTTPS
         │
┌────────▼─────────┐
│  后端 (FastAPI)   │  http://localhost:8000
│      main.py     │
└────────┬─────────┘
         │ SQL
         │
┌────────▼─────────┐
│   MySQL 数据库    │  localhost:3306
│     skytrip      │
└──────────────────┘
```

## 🛑 停止服务

### 使用启动脚本启动的服务

- 关闭对应的 PowerShell 窗口即可

### 手动启动的服务

- 在运行服务的终端按 `Ctrl + C` 停止

## 📝 开发模式说明

### 后端热重载

后端使用 `--reload` 参数启动，代码修改后会自动重启。

### 前端热重载

前端使用 Vite 开发服务器，代码修改后浏览器会自动刷新。

## 🎯 下一步

系统启动成功后，你可以：

1. 访问 API 文档了解所有接口：http://localhost:8000/docs
2. 登录管理界面开始使用系统
3. 根据需要修改配置和代码
4. 查看 `docs/architecture.md` 了解系统架构

## 📞 获取帮助

如果遇到问题：

1. 查看 `docs/setup.md` 了解详细配置说明
2. 查看 `docs/architecture.md` 了解系统架构
3. 检查日志输出中的错误信息
4. 运行 `python verify_env.py` 验证环境配置

---

**祝使用愉快！** 🎉

