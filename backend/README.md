# SkyTrip Backend

这是一个基于 FastAPI 构建的旅行管理后端 API。

## 功能特性

- 用户注册和认证
- 旅行行程管理
- 活动管理
- MySQL 数据库集成
- RESTful API 设计

## 技术栈

- FastAPI - Web 框架
- SQLAlchemy - ORM
- MySQL - 数据库
- Pydantic - 数据验证
- Uvicorn - ASGI 服务器

## 项目结构

```
skytrip-backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── api.py
│   │       └── endpoints.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── db/
│   │   ├── database.py
│   │   └── models.py
│   ├── __init__.py
│   └── schemas.py
├── main.py
├── requirements.txt
└── start.sh
```

### 启动应用

1. 激活 conda 环境：

   ```bash
   conda activate fastpai
   ```

2. 安装依赖：

   ```bash
   pip install -r requirements.txt
   ```

3. 启动应用：
   ```bash
   python main.py
   ```

应用将在 `http://localhost:8000` 启动。

## API 文档

启动应用后，可以访问以下地址查看 API 文档：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
