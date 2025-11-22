import os
from dotenv import load_dotenv

load_dotenv()

# 数据库配置
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', '425425'),
    'database': os.getenv('DB_NAME', 'skytrip'),
    'port': int(os.getenv('DB_PORT', 3306))
}

# Qwen API配置
QWEN_KEY = os.getenv('QWEN_KEY')