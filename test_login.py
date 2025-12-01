#!/usr/bin/env python3
"""测试登录功能"""
from app.database import SessionLocal
from app.models.user import User
from app.core.security import verify_password

db = SessionLocal()
try:
    user = db.query(User).filter(User.username == 'admin').first()
    if user:
        print(f"[OK] User found: {user.username}")
        print(f"    Role: {user.role}")
        print(f"    Is Admin: {user.is_admin}")
        print(f"    Password hash: {user.password[:50]}...")
        test = verify_password('admin123', user.password)
        print(f"    Password verify: {test}")
        if not test:
            print("[ERROR] Password verification failed!")
    else:
        print("[ERROR] Admin user not found!")
        print("Run: python create_admin_now.py")
except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()

