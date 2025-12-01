#!/usr/bin/env python3
"""
快速创建管理员账号
"""
from passlib.context import CryptContext
from sqlalchemy import create_engine, text
from app.core.config import settings
import sys

def create_admin():
    """创建默认管理员账号"""
    # 管理员账号信息
    username = "admin"
    email = "admin@skytrip.com"
    password = "admin123"
    real_name = "系统管理员"
    id_card = "110101199001011234"
    
    # 加密密码
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_password = pwd_context.hash(password)
    
    # 连接数据库
    try:
        engine = create_engine(settings.DATABASE_URL)
        with engine.connect() as conn:
            # 检查是否已存在
            check_sql = text("SELECT id FROM users WHERE username = :username OR email = :email")
            result = conn.execute(check_sql, {"username": username, "email": email}).fetchone()
            
            if result:
                print(f"[信息] 用户名 '{username}' 或邮箱 '{email}' 已存在")
                print("[操作] 自动更新密码...")
                update_sql = text("UPDATE users SET password = :password, role = 'admin' WHERE username = :username")
                conn.execute(update_sql, {"password": hashed_password, "username": username})
                conn.commit()
                print(f"[成功] 管理员账号密码已更新")
            else:
                # 插入新管理员
                insert_sql = text("""
                    INSERT INTO users (username, email, password, real_name, id_card, role) 
                    VALUES (:username, :email, :password, :real_name, :id_card, 'admin')
                """)
                conn.execute(insert_sql, {
                    "username": username,
                    "email": email,
                    "password": hashed_password,
                    "real_name": real_name,
                    "id_card": id_card
                })
                conn.commit()
                print(f"[成功] 管理员账号已创建")
            
            # 显示账号信息
            print("\n" + "=" * 50)
            print("管理员账号信息")
            print("=" * 50)
            print(f"用户名: {username}")
            print(f"密码:   {password}")
            print(f"邮箱:   {email}")
            print(f"真实姓名: {real_name}")
            print(f"角色:   admin")
            print("=" * 50)
            print("\n请使用以上信息登录系统")
            print("登录地址: http://localhost:5173")
            
    except Exception as e:
        print(f"[错误] 创建管理员账号失败: {e}")
        print("\n请检查：")
        print("1. MySQL 服务是否运行")
        print("2. .env 文件中的 DATABASE_URL 是否正确")
        print("3. 数据库 skytrip 是否已创建")
        sys.exit(1)

if __name__ == "__main__":
    print("=" * 50)
    print("创建管理员账号")
    print("=" * 50)
    print()
    create_admin()

