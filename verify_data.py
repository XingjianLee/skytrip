#!/usr/bin/env python3
"""验证数据库数据"""
from app.database import engine
from sqlalchemy import text

conn = engine.connect()
tables = ['users', 'flights', 'orders', 'order_items', 'hotels', 'scenic_spots', 'notifications', 'passengers', 'airlines', 'airports', 'routes']

print("=" * 50)
print("数据库数据统计")
print("=" * 50)
for t in tables:
    try:
        count = conn.execute(text(f"SELECT COUNT(*) FROM {t}")).scalar()
        print(f"{t:20s}: {count:4d} 条")
    except:
        print(f"{t:20s}: 表不存在或错误")

conn.close()
print("=" * 50)

