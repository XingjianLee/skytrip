from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.db.database import engine
from app.db import models
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


try:
    logger.info("正在测试数据库连接...")
    with engine.connect() as conn:
        # 测试查询您的航空公司表
        from sqlalchemy import text
        result = conn.execute(text("SELECT COUNT(*) FROM airlines"))
        count = result.scalar()
        logger.info(f"✅ 数据库连接成功！找到 {count} 条航空公司记录")
except Exception as e:
    logger.error(f"❌ 数据库连接失败: {e}")
    logger.error("请检查数据库配置")
    # 不退出程序，让用户看到错误信息

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SkyTrip Backend API",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# 设置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含API路由
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to SkyTrip Backend API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
