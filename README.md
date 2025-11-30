# SkyTrip 航空旅行一站式服务平台 - 管理员端

## 🚀 快速启动

### 一键启动（Windows）

```powershell
# 启动所有服务（后端 + 前端）
.\start_all.ps1
```

选择选项 3，系统会自动打开两个窗口分别运行后端和前端。

### 分别启动

```powershell
# 终端 1：启动后端
.\start_backend.ps1

# 终端 2：启动前端
.\start_frontend.ps1
```

### 访问系统

- **前端管理界面**：http://localhost:5173
- **后端 API 文档**：http://localhost:8000/docs
- **后端 API 地址**：http://localhost:8000/api/v1

## 📋 系统要求

- Python 3.8+
- Node.js 18+
- MySQL 8.0+
- Windows 10/11（或 Linux/Mac，需要修改启动脚本）

## 📖 详细文档

- **完整启动指南**：[docs/START_GUIDE.md](docs/START_GUIDE.md)
- **环境配置说明**：[docs/setup.md](docs/setup.md)
- **系统架构文档**：[docs/architecture.md](docs/architecture.md)

## 🔧 首次使用

1. **配置环境变量**
   ```bash
   python setup_env.py
   ```

2. **验证配置**
   ```bash
   python verify_env.py
   ```

3. **导入数据库**
   - 创建数据库 `skytrip`
   - 按顺序导入 `sql/` 目录下的所有 SQL 文件

4. **创建管理员账号**
   - 在数据库中插入管理员用户（role='admin'）

5. **启动系统**
   ```powershell
   .\start_all.ps1
   ```

## 📁 项目结构

```
skytrip/
├── admin-frontend/      # 前端项目（Vue 3 + TypeScript）
├── app/                 # 后端应用代码
│   ├── api/            # API 路由
│   ├── core/           # 核心配置
│   ├── models/         # 数据模型
│   ├── schemas/        # Pydantic 模式
│   └── services/       # 业务逻辑
├── docs/               # 文档
├── sql/                # 数据库脚本
├── main.py             # 后端入口
├── requirements.txt    # Python 依赖
└── start_*.ps1         # 启动脚本
```

## 🎯 主要功能

- ✅ 管理员登录认证（JWT）
- ✅ 航班管理（CRUD）
- ✅ 酒店管理（CRUD）
- ✅ 景点管理（CRUD）
- ✅ 用户管理（查看、冻结/解冻）
- ✅ 订单管理（查看、修改状态）
- ✅ 通知管理（发送系统通知）
- ✅ 财务报表（收入统计、订单分析）

## 🔒 安全特性

- JWT Token 认证
- 密码 bcrypt 加密
- RBAC 权限控制
- 敏感字段脱敏
- SQL 注入防护
- XSS 防护

## 📝 开发说明

### 后端技术栈

- FastAPI
- SQLAlchemy
- Pydantic
- MySQL
- JWT 认证

### 前端技术栈

- Vue 3
- TypeScript
- Ant Design Vue
- Pinia
- Vue Router
- Axios

## 🐛 问题排查

遇到问题请查看：[docs/START_GUIDE.md](docs/START_GUIDE.md) 中的"常见问题排查"部分。

## 📄 许可证

本项目为课程设计项目。

---

**开发团队** | **版本** 1.0.0 | **最后更新** 2025

