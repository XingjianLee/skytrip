# SkyTrip 管理员端系统配置指南

## 环境变量配置

### 方式一：使用 .env 文件（推荐）

1. **创建 .env 文件**
   
   在项目根目录（`D:\competition\skytrip\`）下创建 `.env` 文件。

2. **复制模板并修改**
   
   参考 `env.example` 文件，复制内容到 `.env` 并修改相应值：

   ```bash
   # Windows PowerShell
   Copy-Item env.example .env
   
   # 或手动创建 .env 文件
   ```

3. **配置内容示例**

   ```env
   # 数据库连接（根据你的 MySQL 配置修改）
   # ⚠️ 注意：如果密码包含特殊字符（@、#、% 等），需要进行 URL 编码
   DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/skytrip
   
   # JWT 密钥（必须修改为强随机字符串）
   SECRET_KEY=your-super-secret-key-change-this-in-production
   
   # 其他配置（可选，有默认值）
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   BCRYPT_ROUNDS=12
   ```

4. **处理密码中的特殊字符**

   如果数据库密码包含特殊字符（如 `@`、`#`、`%`、`&` 等），需要进行 URL 编码：
   
   **方法一：使用配置脚本（自动处理）**
   ```bash
   python setup_env.py
   ```
   脚本会自动对密码进行编码。
   
   **方法二：手动编码**
   ```bash
   # 使用提供的工具脚本
   python encode_password.py "你的密码"
   
   # 或使用 Python 命令
   python -c "from urllib.parse import quote_plus; print(quote_plus('你的密码'))"
   ```
   
   **特殊字符编码对照表：**
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`
   - `&` → `%26`
   - `+` → `%2B`
   - `/` → `%2F`
   - `?` → `%3F`
   - `=` → `%3D`
   
   **示例：**
   - 原始密码：`@LYMoa4pta8w`
   - 编码后：`%40LYMoa4pta8w`
   - 在 .env 中使用：`DATABASE_URL=mysql+pymysql://root:%40LYMoa4pta8w@localhost:3306/skytrip`

### 方式二：系统环境变量

在 Windows 系统环境变量中设置：

1. 打开"系统属性" → "高级" → "环境变量"
2. 在"用户变量"或"系统变量"中添加：
   - `DATABASE_URL=mysql+pymysql://root:password@localhost:3306/skytrip`
   - `SECRET_KEY=your-secret-key`

### 生成安全的 SECRET_KEY

使用 Python 生成随机密钥：

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

或使用在线工具生成至少 32 个字符的随机字符串。

## 数据库配置

### 1. 确保 MySQL 服务运行

```bash
# 检查 MySQL 服务状态
# Windows 服务管理器或命令行
```

### 2. 创建数据库

```sql
CREATE DATABASE IF NOT EXISTS skytrip CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 导入 SQL 文件

按顺序执行 `sql/` 目录下的 SQL 文件：

```bash
# 方式一：使用 MySQL 命令行
mysql -u root -p skytrip < sql/airlines.sql
mysql -u root -p skytrip < sql/airports.sql
mysql -u root -p skytrip < sql/routes.sql
mysql -u root -p skytrip < sql/flights.sql
mysql -u root -p skytrip < sql/flight_pricing.sql
mysql -u root -p skytrip < sql/users.sql
mysql -u root -p skytrip < sql/passengers.sql
mysql -u root -p skytrip < sql/orders.sql
mysql -u root -p skytrip < sql/order_items.sql
mysql -u root -p skytrip < sql/check_ins.sql
mysql -u root -p skytrip < sql/agencies.sql
mysql -u root -p skytrip < sql/admin_extension.sql

# 方式二：使用 Navicat 或其他数据库工具逐个导入
```

### 4. 创建管理员账号

```sql
-- 方式一：直接插入（密码需要先加密）
-- 使用 Python 脚本生成加密密码后插入

-- 方式二：通过注册接口创建（如果已实现）
-- 或使用后端提供的初始化脚本
```

## 快速启动

### 后端启动

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 确保 .env 文件已配置

# 3. 启动服务
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

访问 API 文档：http://localhost:8000/docs

### 前端启动

```bash
# 1. 进入前端目录
cd admin-frontend

# 2. 安装依赖
npm install
# 或
pnpm install

# 3. 创建前端 .env 文件（可选，默认连接 localhost:8000）
# VITE_API_BASE=http://localhost:8000

# 4. 启动开发服务器
npm run dev
```

访问前端界面：http://localhost:5173

## 配置检查清单

- [ ] `.env` 文件已创建并配置
- [ ] `DATABASE_URL` 格式正确（用户名、密码、主机、端口、数据库名）
- [ ] `SECRET_KEY` 已修改为强随机字符串
- [ ] MySQL 服务正在运行
- [ ] 数据库 `skytrip` 已创建
- [ ] 所有 SQL 文件已导入
- [ ] 后端依赖已安装（`pip install -r requirements.txt`）
- [ ] 前端依赖已安装（`npm install`）

## 常见问题

### 1. 数据库连接失败

- 检查 MySQL 服务是否运行
- 验证 `DATABASE_URL` 中的用户名、密码、端口是否正确
- 确认数据库 `skytrip` 已创建
- **如果密码包含特殊字符（@、#、% 等），必须进行 URL 编码**
  - 使用 `python encode_password.py "你的密码"` 获取编码后的密码
  - 或使用 `python setup_env.py` 自动处理

### 2. JWT 认证失败

- 确认 `SECRET_KEY` 已正确设置
- 检查 token 是否过期（默认 60 分钟）

### 3. 前端无法连接后端

- 检查后端是否在运行（http://localhost:8000）
- 检查前端 `.env` 中的 `VITE_API_BASE` 配置
- 检查浏览器控制台的 CORS 错误

