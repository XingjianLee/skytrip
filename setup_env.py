#!/usr/bin/env python3
"""
SkyTrip 管理员端环境配置脚本
用于快速创建 .env 配置文件
"""
import secrets
import os
from pathlib import Path
from urllib.parse import quote_plus

def generate_secret_key():
    """生成安全的随机密钥"""
    return secrets.token_urlsafe(32)

def encode_password(password: str) -> str:
    """
    对数据库密码进行 URL 编码
    处理密码中的特殊字符（如 @、#、% 等）
    """
    return quote_plus(password)

def create_env_file():
    """创建 .env 文件"""
    env_path = Path(".env")
    example_path = Path("env.example")
    
    if env_path.exists():
        response = input(".env 文件已存在，是否覆盖？(y/N): ")
        if response.lower() != 'y':
            print("已取消操作")
            return
    
    # 读取示例文件
    if example_path.exists():
        with open(example_path, 'r', encoding='utf-8') as f:
            content = f.read()
    else:
        # 如果示例文件不存在，使用默认模板
        content = """# SkyTrip 管理员端后端配置
DATABASE_URL=mysql+pymysql://root:root@localhost:3306/skytrip
SECRET_KEY={secret_key}
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_MINUTES=10080
PROJECT_NAME=SkyTrip Admin Platform
VERSION=1.0.0
API_PREFIX=/api/v1
BCRYPT_ROUNDS=12
JWT_ALGORITHM=HS256
"""
    
    # 生成新的 SECRET_KEY
    secret_key = generate_secret_key()
    if "{secret_key}" in content:
        content = content.replace("{secret_key}", secret_key)
    elif "SECRET_KEY=change-me" in content:
        content = content.replace("SECRET_KEY=change-me", f"SECRET_KEY={secret_key}")
    elif "SECRET_KEY=change-me-please-use-a-strong-random-secret-key-here" in content:
        content = content.replace(
            "SECRET_KEY=change-me-please-use-a-strong-random-secret-key-here",
            f"SECRET_KEY={secret_key}"
        )
    
    # 交互式配置数据库连接
    print("\n=== 数据库配置 ===")
    print("请输入数据库连接信息（直接回车使用默认值）")
    
    db_user = input("数据库用户名 [root]: ").strip() or "root"
    db_password = input("数据库密码 [root]: ").strip() or "root"
    db_host = input("数据库主机 [localhost]: ").strip() or "localhost"
    db_port = input("数据库端口 [3306]: ").strip() or "3306"
    db_name = input("数据库名称 [skytrip]: ").strip() or "skytrip"
    
    # 对用户名和密码进行 URL 编码，处理特殊字符（如 @、#、% 等）
    encoded_user = quote_plus(db_user)
    encoded_password = encode_password(db_password)
    
    database_url = f"mysql+pymysql://{encoded_user}:{encoded_password}@{db_host}:{db_port}/{db_name}"
    
    # 替换 DATABASE_URL
    import re
    content = re.sub(
        r'DATABASE_URL=.*',
        f'DATABASE_URL={database_url}',
        content
    )
    
    # 写入 .env 文件
    with open(env_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n✅ .env 文件已创建！")
    print(f"📁 位置: {env_path.absolute()}")
    print(f"🔑 SECRET_KEY 已自动生成")
    print(f"💾 DATABASE_URL: {database_url}")
    print("\n⚠️  请确保：")
    print("   1. MySQL 服务正在运行")
    print("   2. 数据库已创建并导入 SQL 文件")
    print("   3. 数据库连接信息正确")

if __name__ == "__main__":
    print("=" * 50)
    print("SkyTrip 管理员端环境配置工具")
    print("=" * 50)
    create_env_file()

