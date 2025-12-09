from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.v1.api import api_router

# 创建FastAPI应用实例
app = FastAPI(
    title="SkyTrip Backend",
    description="SkyTrip 旅游预订系统后端API",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # 允许的前端源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册API路由
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    """根路径"""
    return {"message": "欢迎使用 SkyTrip Backend API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy", "message": "服务运行正常"}

@app.get("/api/v1/test")
async def test_api():
    """测试API"""
    return {"message": "API测试成功", "data": {"test": True}}