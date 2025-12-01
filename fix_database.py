#!/usr/bin/env python3
"""修复数据库结构"""
from app.database import engine
from sqlalchemy import text

def fix_database():
    """添加缺失的字段"""
    conn = engine.connect()
    try:
        # 检查 is_frozen 字段是否存在
        check_sql = text("""
            SELECT COUNT(*) as cnt 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'users' 
            AND COLUMN_NAME = 'is_frozen'
        """)
        result = conn.execute(check_sql).fetchone()
        
        if result and result[0] == 0:
            print("[INFO] Adding is_frozen column to users table...")
            alter_sql = text("ALTER TABLE users ADD COLUMN is_frozen TINYINT(1) DEFAULT 0 AFTER id_issuer")
            conn.execute(alter_sql)
            conn.commit()
            print("[OK] Column is_frozen added successfully")
        else:
            print("[INFO] Column is_frozen already exists")
        
        print("[OK] Database structure is correct")
        
    except Exception as e:
        print(f"[ERROR] {e}")
        import traceback
        traceback.print_exc()
    finally:
        conn.close()

if __name__ == "__main__":
    print("=" * 50)
    print("Fixing Database Structure")
    print("=" * 50)
    print()
    fix_database()

