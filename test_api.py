#!/usr/bin/env python3
"""测试 API 是否能正常工作"""
from app.database import SessionLocal
from app.models import Flight, Hotel, ScenicSpot, Notification, Order, User
from sqlalchemy import text

db = SessionLocal()
try:
    print("=" * 60)
    print("测试数据库查询")
    print("=" * 60)
    
    # 测试各个表的查询
    tests = [
        ("Flights", lambda: db.query(Flight).count()),
        ("Hotels", lambda: db.query(Hotel).count()),
        ("ScenicSpots", lambda: db.query(ScenicSpot).count()),
        ("Notifications", lambda: db.query(Notification).count()),
        ("Orders", lambda: db.query(Order).count()),
        ("Users", lambda: db.query(User).count()),
    ]
    
    for name, test_func in tests:
        try:
            count = test_func()
            print(f"[OK] {name:20s}: {count:4d} 条记录")
        except Exception as e:
            print(f"[ERROR] {name:20s}: {str(e)[:50]}")
    
    print("=" * 60)
    print("测试完成")
    print("=" * 60)
    
except Exception as e:
    print(f"[ERROR] 测试失败: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()

