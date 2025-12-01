#!/usr/bin/env python3
"""
修复所有表问题：确保所有表存在并正确创建
"""
from app.database import engine, Base
from sqlalchemy import text, inspect
from app.models import (
    User, Order, OrderItem, Flight, Hotel, ScenicSpot, Notification
)

def check_and_create_tables():
    """检查并创建所有缺失的表"""
    conn = engine.connect()
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    print("=" * 60)
    print("检查和创建数据库表")
    print("=" * 60)
    print()
    
    required_tables = {
        'hotels': """
            CREATE TABLE IF NOT EXISTS `hotels` (
              `hotel_id` int NOT NULL AUTO_INCREMENT,
              `name` varchar(120) NOT NULL,
              `city` varchar(50) NOT NULL,
              `address` varchar(255) DEFAULT NULL,
              `star_rating` tinyint DEFAULT 3,
              `description` text,
              `phone` varchar(30) DEFAULT NULL,
              `status` enum('active','inactive') DEFAULT 'active',
              `lowest_price` decimal(10,2) DEFAULT 0,
              PRIMARY KEY (`hotel_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
        """,
        'scenic_spots': """
            CREATE TABLE IF NOT EXISTS `scenic_spots` (
              `spot_id` int NOT NULL AUTO_INCREMENT,
              `name` varchar(120) NOT NULL,
              `city` varchar(50) NOT NULL,
              `address` varchar(255) DEFAULT NULL,
              `description` text,
              `open_time` varchar(50) DEFAULT NULL,
              `close_time` varchar(50) DEFAULT NULL,
              `ticket_price` decimal(10,2) DEFAULT 0,
              `status` enum('active','inactive') DEFAULT 'active',
              PRIMARY KEY (`spot_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
        """,
        'notifications': """
            CREATE TABLE IF NOT EXISTS `notifications` (
              `notification_id` int NOT NULL AUTO_INCREMENT,
              `title` varchar(120) NOT NULL,
              `content` text NOT NULL,
              `target_user_id` bigint DEFAULT NULL,
              `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
              `created_by` bigint NOT NULL,
              `is_read` tinyint(1) DEFAULT 0,
              PRIMARY KEY (`notification_id`),
              KEY `idx_target_user` (`target_user_id`),
              CONSTRAINT `fk_notifications_target` FOREIGN KEY (`target_user_id`) 
                REFERENCES `users` (`id`) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
        """
    }
    
    for table_name, create_sql in required_tables.items():
        if table_name not in existing_tables:
            print(f"[创建] {table_name} 表...")
            try:
                conn.execute(text(create_sql))
                conn.commit()
                print(f"  [OK] {table_name} 表已创建")
            except Exception as e:
                print(f"  [ERROR] 创建 {table_name} 表失败: {e}")
        else:
            print(f"[存在] {table_name} 表已存在")
    
    # 检查 routes 表
    if 'routes' not in existing_tables:
        print("[WARN] routes 表不存在，这可能导致外键问题")
        print("  请确保已导入 sql/routes.sql")
    
    conn.close()
    print()
    print("=" * 60)
    print("表检查完成")
    print("=" * 60)

def create_all_tables_from_models():
    """使用 SQLAlchemy 创建所有模型对应的表"""
    print()
    print("=" * 60)
    print("使用 SQLAlchemy ORM 创建表结构")
    print("=" * 60)
    print()
    
    try:
        # 导入所有模型以确保它们被注册
        from app.models import (
            User, Order, OrderItem, Flight, Hotel, ScenicSpot, Notification
        )
        
        # 只创建不存在的表，不删除现有表
        Base.metadata.create_all(bind=engine, checkfirst=True)
        print("[OK] 所有模型表已确保存在")
        
    except Exception as e:
        print(f"[ERROR] 创建表失败: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_and_create_tables()
    create_all_tables_from_models()
    print()
    print("修复完成！")

