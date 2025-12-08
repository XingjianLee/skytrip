# 🚀 SkyTrip 管理员端系统运行详细步骤

## 📋 目录

1. [环境检查](#1-环境检查)
2. [数据库准备](#2-数据库准备)
3. [后端配置与启动](#3-后端配置与启动)
4. [前端配置与启动](#4-前端配置与启动)
5. [访问系统](#5-访问系统)
6. [常见问题](#6-常见问题)

---

## 1. 环境检查

### 1.1 检查必需软件

在开始之前，请确保已安装以下软件：

#### Python 3.8+
```powershell
# 检查 Python 版本
python --version
# 应该显示类似：Python 3.9.x 或更高版本
```

如果没有安装，请访问：https://www.python.org/downloads/
- ⚠️ **重要**：安装时勾选 "Add Python to PATH"

#### Node.js 18+ 和 npm
```powershell
# 检查 Node.js 版本
node --version
# 应该显示类似：v18.x.x 或更高版本

# 检查 npm 版本
npm --version
# 应该显示类似：9.x.x 或更高版本
```

如果没有安装，请访问：https://nodejs.org/

#### MySQL 8.0+
```powershell
# 检查 MySQL 服务是否运行
# Windows: 在服务管理器中查看 MySQL 服务
# 或使用命令：
Get-Service -Name MySQL*
```

如果没有安装，请访问：https://dev.mysql.com/downloads/mysql/

---

## 2. 数据库准备

### 2.1 创建数据库

打开 MySQL 客户端（如 MySQL Workbench、Navicat 或命令行），执行：

```sql
CREATE DATABASE IF NOT EXISTS skytrip 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### 2.2 导入数据库表结构

按以下顺序执行 `sql/` 目录下的 SQL 文件：

```sql
-- 1. 基础表
source sql/airlines.sql;
source sql/airports.sql;
source sql/routes.sql;
source sql/flights.sql;
source sql/flight_pricing.sql;

-- 2. 用户相关表
source sql/users.sql;
source sql/passengers.sql;
source sql/agencies.sql;

-- 3. 订单相关表
source sql/orders.sql;
source sql/order_items.sql;
source sql/check_ins.sql;

-- 4. 管理员扩展表
source sql/admin_extension.sql;
```

**或者使用 MySQL 客户端工具**：
- 在 MySQL Workbench 中：File → Run SQL Script → 选择文件
- 在 Navicat 中：右键数据库 → 运行 SQL 文件

### 2.3 初始化测试数据（可选）

如果需要测试数据，运行：

```powershell
# 确保在项目根目录
python init_database.py
```

这会自动：
- 创建缺失的表
- 插入测试数据（用户、航班、订单等）
- 创建管理员账号（用户名：admin，密码：admin123）

---

## 3. 后端配置与启动

### 3.1 配置环境变量

#### 方式一：使用自动配置脚本（推荐）

```powershell
# 在项目根目录运行
python setup_env.py
```

脚本会引导你输入：
- 数据库用户名（默认：root）
- 数据库密码（会自动处理特殊字符）
- 数据库主机（默认：localhost）
- 数据库端口（默认：3306）
- 数据库名称（默认：skytrip）
- JWT 密钥（会自动生成）

#### 方式二：手动创建 .env 文件

在项目根目录创建 `.env` 文件：

```env
# 数据库连接（如果密码包含特殊字符，需要 URL 编码）
# 例如：密码是 @LYMoa4pta8w，编码后是 %40LYMoa4pta8w
DATABASE_URL=mysql+pymysql://root:你的密码@localhost:3306/skytrip

# JWT 密钥（必须修改，使用强随机字符串）
SECRET_KEY=你的随机密钥字符串

# 其他配置（可选）
ACCESS_TOKEN_EXPIRE_MINUTES=60
BCRYPT_ROUNDS=12
```

**如果密码包含特殊字符**（如 @、#、% 等），使用编码工具：

```powershell
python encode_password.py "你的密码"
```

然后将编码后的密码填入 `DATABASE_URL`。

#### 验证环境配置

```powershell
python verify_env.py
```

应该显示：
```
[OK] .env 文件存在
[OK] DATABASE_URL 已配置
[OK] SECRET_KEY 已配置
[OK] 数据库连接成功
```

### 3.2 安装后端依赖

#### 创建虚拟环境（如果还没有）

```powershell
python -m venv venv
```

#### 激活虚拟环境

```powershell
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows CMD
venv\Scripts\activate.bat

# Linux/Mac
source venv/bin/activate
```

激活成功后，命令提示符前会显示 `(venv)`。

#### 安装依赖包

```powershell
pip install -r requirements.txt
```

如果下载慢，可以使用国内镜像：

```powershell
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 3.3 创建管理员账号

如果还没有管理员账号，运行：

```powershell
python create_admin.py
```

或者使用快速创建脚本：

```powershell
python create_admin_now.py
```

默认管理员账号：
- 用户名：`admin`
- 密码：`admin123`

### 3.4 启动后端服务

#### 方式一：使用启动脚本（推荐）

```powershell
.\start_backend.ps1
```

脚本会自动：
- 检查 Python 环境
- 检查 .env 文件
- 激活虚拟环境
- 安装依赖（如果需要）
- 启动服务

#### 方式二：手动启动

```powershell
# 确保虚拟环境已激活
.\venv\Scripts\Activate.ps1

# 启动服务
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3.5 验证后端服务

打开浏览器访问：

- **API 文档（Swagger）**：http://localhost:8000/docs
- **ReDoc 文档**：http://localhost:8000/redoc
- **API 根路径**：http://localhost:8000/api/v1

如果看到 API 文档页面，说明后端启动成功！✅

---

## 4. 前端配置与启动

### 4.1 进入前端目录

```powershell
cd admin-frontend
```

### 4.2 配置前端环境变量（可选）

如果后端不在 `http://localhost:8000`，需要创建 `.env` 文件：

```powershell
# 在 admin-frontend 目录下
New-Item -Path .env -ItemType File -Force
```

编辑 `.env` 文件：

```env
# 后端 API 地址
VITE_API_BASE=http://localhost:8000
```

### 4.3 安装前端依赖

```powershell
npm install
```

如果下载慢，可以使用国内镜像：

```powershell
npm config set registry https://registry.npmmirror.com
npm install
```

### 4.4 启动前端服务

#### 方式一：使用启动脚本（推荐）

```powershell
# 在项目根目录
.\start_frontend.ps1
```

#### 方式二：手动启动

```powershell
# 在 admin-frontend 目录下
npm run dev
```

### 4.5 验证前端服务

前端启动后，应该看到：

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

打开浏览器访问：http://localhost:5173

如果看到登录页面，说明前端启动成功！✅

---

## 5. 访问系统

### 5.1 登录系统

1. 打开浏览器访问：http://localhost:5173
2. 使用管理员账号登录：
   - **用户名**：`admin`（或你创建的管理员用户名）
   - **密码**：`admin123`（或你设置的密码）

### 5.2 系统功能

登录成功后，可以使用以下功能：

#### 📊 仪表盘
- 查看系统概览和统计数据

#### ✈️ 航班管理
- 查看航班列表
- 添加新航班
- 编辑航班信息
- 删除航班
- 管理航班状态

#### 🏨 酒店管理
- 查看酒店列表
- 添加新酒店
- 编辑酒店信息
- 管理酒店状态

#### 🎫 景点管理
- 查看景点列表
- 添加新景点
- 编辑景点信息
- 管理景点状态

#### 👥 用户管理
- 查看用户列表
- 搜索用户
- 冻结/解冻用户账号
- 查看用户详情

#### 📦 订单管理（新增功能）
- 查看订单列表（支持搜索和筛选）
- 查看订单详情
- 修改订单状态
- **订单退款**（新增）
- **订单改签**（新增）
- 按订单号、用户名、状态、日期等筛选

#### 🔔 通知管理
- 查看通知列表
- 发送系统通知
- 管理通知内容

#### 📈 财务报表
- 查看收入统计
- 查看订单统计
- 导出报表数据

---

## 6. 常见问题

### 6.1 后端问题

#### 问题：数据库连接失败

**错误信息**：
```
sqlalchemy.exc.OperationalError: (2003, "Can't connect to MySQL server")
```

**解决方案**：
1. 检查 MySQL 服务是否运行
   ```powershell
   Get-Service -Name MySQL*
   ```
2. 验证 `.env` 文件中的 `DATABASE_URL` 是否正确
3. 确认数据库 `skytrip` 已创建
4. 如果密码包含特殊字符，确保已进行 URL 编码
   ```powershell
   python encode_password.py "你的密码"
   ```

#### 问题：端口 8000 被占用

**错误信息**：
```
ERROR: [Errno 10048] error while attempting to bind on address
```

**解决方案**：
1. 查找占用端口的进程：
   ```powershell
   netstat -ano | findstr :8000
   ```
2. 关闭占用端口的程序，或修改端口：
   ```powershell
   uvicorn main:app --reload --host 0.0.0.0 --port 8001
   ```

#### 问题：依赖安装失败

**解决方案**：
1. 升级 pip：
   ```powershell
   python -m pip install --upgrade pip
   ```
2. 使用国内镜像：
   ```powershell
   pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
   ```

#### 问题：表不存在

**错误信息**：
```
sqlalchemy.exc.ProgrammingError: (1146, "Table 'skytrip.xxx' doesn't exist")
```

**解决方案**：
1. 运行数据库初始化脚本：
   ```powershell
   python init_database.py
   ```
2. 或手动执行 SQL 文件创建表

### 6.2 前端问题

#### 问题：npm install 失败

**解决方案**：
1. 清除缓存：
   ```powershell
   npm cache clean --force
   ```
2. 删除 `node_modules` 和 `package-lock.json`，重新安装
3. 使用国内镜像：
   ```powershell
   npm config set registry https://registry.npmmirror.com
   npm install
   ```

#### 问题：无法连接后端 API

**错误信息**：
```
Network Error
Failed to fetch
```

**解决方案**：
1. 确认后端服务正在运行（访问 http://localhost:8000/docs）
2. 检查 `admin-frontend/.env` 中的 `VITE_API_BASE` 配置
3. 查看浏览器控制台的错误信息（F12）
4. 检查 CORS 设置（后端已配置允许跨域）

#### 问题：端口 5173 被占用

**解决方案**：
1. 修改 `admin-frontend/vite.config.ts` 中的端口
2. 或使用命令行指定端口：
   ```powershell
   npm run dev -- --port 5174
   ```

### 6.3 登录问题

#### 问题：登录失败 - 账号不存在或无权限

**解决方案**：
1. 确认数据库中已创建管理员账号：
   ```powershell
   python create_admin.py
   ```
2. 检查用户的 `role` 字段是否为 `'admin'`
3. 验证用户名和密码是否正确

#### 问题：JWT Token 错误

**解决方案**：
1. 检查 `.env` 文件中的 `SECRET_KEY` 是否正确
2. 清除浏览器缓存和 Cookie
3. 重新登录

### 6.4 一键启动问题

#### 问题：PowerShell 脚本无法执行

**错误信息**：
```
无法加载文件，因为在此系统上禁止运行脚本
```

**解决方案**：
1. 以管理员身份运行 PowerShell
2. 执行：
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

---

## 7. 快速启动命令总结

### 完整启动流程（推荐）

```powershell
# 1. 检查环境
python --version
node --version

# 2. 配置环境变量（首次运行）
python setup_env.py

# 3. 初始化数据库（首次运行）
python init_database.py

# 4. 创建管理员账号（首次运行）
python create_admin.py

# 5. 一键启动所有服务
.\start_all.ps1
# 选择选项 3
```

### 分别启动

```powershell
# 终端 1：启动后端
.\start_backend.ps1

# 终端 2：启动前端
.\start_frontend.ps1
```

---

## 8. 系统访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端界面 | http://localhost:5173 | 管理员登录界面 |
| 后端 API | http://localhost:8000/api/v1 | API 接口地址 |
| API 文档 | http://localhost:8000/docs | Swagger 文档 |
| ReDoc 文档 | http://localhost:8000/redoc | ReDoc 文档 |

---

## 9. 停止服务

### 使用启动脚本启动的服务

- 关闭对应的 PowerShell 窗口即可

### 手动启动的服务

- 在运行服务的终端按 `Ctrl + C` 停止

---

## 10. 开发模式说明

### 后端热重载

后端使用 `--reload` 参数启动，代码修改后会自动重启。

### 前端热重载

前端使用 Vite 开发服务器，代码修改后浏览器会自动刷新。

---

## 📞 获取帮助

如果遇到问题：

1. 查看 `docs/setup.md` 了解详细配置说明
2. 查看 `docs/architecture.md` 了解系统架构
3. 检查日志输出中的错误信息
4. 运行 `python verify_env.py` 验证环境配置
5. 运行 `python verify_data.py` 检查数据库数据

---

**祝使用愉快！** 🎉

