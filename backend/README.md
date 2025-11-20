# SkyTrip Backend

SkyTrip 航班预订系统后端 API，基于 FastAPI 构建。

## 功能特性

- 🚀 基于 FastAPI 的高性能 API
- 🔐 JWT 身份认证
- 📊 SQLAlchemy ORM 数据库操作
- 🔄 Alembic 数据库迁移
- 📝 自动生成 API 文档
- 🧪 完整的测试覆盖
- 🐳 Docker 容器化支持

## 技术栈

- **框架**: FastAPI
- **数据库**: MySQL
- **ORM**: SQLAlchemy
- **认证**: JWT (python-jose)
- **密码加密**: bcrypt
- **数据验证**: Pydantic
- **数据库迁移**: Alembic

## 快速开始

### 环境要求

- Python 3.8+
- MySQL 8.0+

### 安装依赖

```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置数据库连接等信息
```

### 数据库设置

```bash
# 初始化 Alembic
alembic init alembic

# 创建迁移文件
alembic revision --autogenerate -m "Initial migration"

# 执行迁移
alembic upgrade head
```

### 运行应用

```bash
# 开发模式
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 生产模式
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 访问 API 文档

启动应用后，访问以下地址查看 API 文档：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API 端点

### 认证
- `POST /api/v1/auth/login` - 用户登录

### 用户管理
- `POST /api/v1/users/` - 创建用户
- `GET /api/v1/users/` - 获取用户列表（管理员）
- `GET /api/v1/users/me` - 获取当前用户信息
- `GET /api/v1/users/{user_id}` - 获取指定用户信息
- `PUT /api/v1/users/me` - 更新当前用户信息
- `PUT /api/v1/users/{user_id}` - 更新用户信息（管理员）

## 项目结构

```
backend/
├── app/                    # 应用主目录
│   ├── api/               # API 路由
│   ├── core/              # 核心功能
│   ├── crud/              # 数据访问层
│   ├── models/            # 数据库模型
│   ├── schemas/           # Pydantic 模式
│   ├── config.py          # 配置管理
│   ├── database.py        # 数据库连接
│   ├── dependencies.py    # 依赖注入
│   └── main.py           # 应用入口
├── alembic/              # 数据库迁移
├── tests/                # 测试代码
├── requirements.txt      # 依赖包
└── README.md            # 项目说明
```

## 开发指南

### 添加新的 API 端点

1. 在 `app/models/` 中定义数据模型
2. 在 `app/schemas/` 中定义 Pydantic 模式
3. 在 `app/crud/` 中实现数据操作
4. 在 `app/api/v1/` 中创建 API 路由
5. 在 `app/api/v1/api.py` 中注册路由

### 数据库迁移

```bash
# 创建新的迁移文件
alembic revision --autogenerate -m "描述信息"

# 执行迁移
alembic upgrade head

# 回滚迁移
alembic downgrade -1
```

### 运行测试

```bash
# 运行所有测试
pytest

# 运行特定测试文件
pytest tests/test_users.py

# 生成测试覆盖率报告
pytest --cov=app tests/
```

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -t skytrip-backend .

# 运行容器
docker run -d -p 8000:8000 --name skytrip-backend skytrip-backend
```

### 使用 Docker Compose

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。# skytrip_backend
