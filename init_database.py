#!/usr/bin/env python3
"""
初始化数据库：创建缺失的表并插入测试数据
"""
import random
from datetime import datetime, timedelta, date, time
from decimal import Decimal
from passlib.context import CryptContext

from app.database import engine, SessionLocal
from app.models import (
    User, Order, OrderItem, Flight, Hotel, ScenicSpot, Notification
)
from sqlalchemy import text

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 测试数据
CITIES = ["北京", "上海", "广州", "深圳", "成都", "杭州", "西安", "南京", "武汉", "重庆"]
AIRLINE_CODES = ["CA", "MU", "CZ", "3U", "9C", "HO", "JD", "KN"]
AIRLINE_NAMES = {
    "CA": "中国国际航空",
    "MU": "中国东方航空",
    "CZ": "中国南方航空",
    "3U": "四川航空",
    "9C": "春秋航空",
    "HO": "吉祥航空",
    "JD": "首都航空",
    "KN": "中国联合航空"
}
AIRCRAFT_TYPES = ["B737", "A320", "A330", "B777", "A350", "B787"]
FIRST_NAMES = ["张", "李", "王", "刘", "陈", "杨", "赵", "黄", "周", "吴"]
LAST_NAMES = ["伟", "芳", "娜", "秀英", "敏", "静", "丽", "强", "磊", "军", "洋", "勇", "艳", "杰", "涛", "明", "超", "秀兰", "霞", "平"]
HOTEL_NAMES = [
    "希尔顿酒店", "万豪酒店", "香格里拉酒店", "洲际酒店", "喜来登酒店",
    "凯悦酒店", "丽思卡尔顿", "四季酒店", "文华东方", "瑞吉酒店"
]
SCENIC_NAMES = [
    "故宫博物院", "天坛公园", "颐和园", "长城", "西湖",
    "外滩", "东方明珠", "兵马俑", "大雁塔", "黄鹤楼"
]

def create_missing_tables():
    """创建缺失的表"""
    conn = engine.connect()
    try:
        print("[1/2] 检查并创建缺失的表...")
        
        # 检查并创建 notifications 表
        check_sql = text("""
            SELECT COUNT(*) as cnt 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'notifications'
        """)
        result = conn.execute(check_sql).fetchone()
        
        if not result or result[0] == 0:
            print("  创建 notifications 表...")
            create_notifications = text("""
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
            """)
            conn.execute(create_notifications)
            conn.commit()
            print("  [OK] notifications 表已创建")
        else:
            print("  [INFO] notifications 表已存在")
        
        # 检查并创建 hotels 表
        check_hotels = text("""
            SELECT COUNT(*) as cnt 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'hotels'
        """)
        result = conn.execute(check_hotels).fetchone()
        if not result or result[0] == 0:
            print("  创建 hotels 表...")
            create_hotels = text("""
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
            """)
            conn.execute(create_hotels)
            conn.commit()
            print("  [OK] hotels 表已创建")
        
        # 检查并创建 scenic_spots 表
        check_spots = text("""
            SELECT COUNT(*) as cnt 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'scenic_spots'
        """)
        result = conn.execute(check_spots).fetchone()
        if not result or result[0] == 0:
            print("  创建 scenic_spots 表...")
            create_spots = text("""
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
            """)
            conn.execute(create_spots)
            conn.commit()
            print("  [OK] scenic_spots 表已创建")
        
        print("[OK] 所有表检查完成")
        
    except Exception as e:
        print(f"[ERROR] 创建表失败: {e}")
        import traceback
        traceback.print_exc()
    finally:
        conn.close()

def insert_test_data():
    """插入测试数据"""
    db = SessionLocal()
    try:
        print("[2/2] 插入测试数据...")
        
        # 1. 插入用户数据
        print("  插入用户数据...")
        admin_count = db.query(User).filter(User.role == "admin").count()
        user_count = db.query(User).filter(User.role == "individual").count()
        
        if admin_count == 0:
            # 管理员账号
            admin = User(
                username="admin",
                email="admin@skytrip.com",
                password=pwd_context.hash("admin123"),
                real_name="系统管理员",
                id_card="110101199001011234",
                role="admin",
                phone="13800138000",
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.add(admin)
            db.commit()
            print(f"    [OK] 已创建管理员账号")
        
        if user_count < 20:
            # 普通用户 - 使用原始SQL避免ORM外键问题
            for i in range(user_count + 1, 21):
                name = f"{random.choice(FIRST_NAMES)}{random.choice(LAST_NAMES)}"
                id_card_val = f"110101199{i%10}{i%12+1:02d}{i%28+1:02d}{i:04d}"
                password_hash = pwd_context.hash("123456")
                created_date = (datetime.now() - timedelta(days=random.randint(1, 365))).strftime('%Y-%m-%d %H:%M:%S')
                updated_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                vip = random.choice([0, 0, 0, 1, 2])
                
                db.execute(text(f"""
                    INSERT INTO users (username, email, password, real_name, id_card, role, phone, vip_level, created_at, updated_at)
                    VALUES ('user{i:03d}', 'user{i:03d}@example.com', '{password_hash}', '{name}', 
                            '{id_card_val}', 'individual', '138{i:08d}', {vip}, 
                            '{created_date}', '{updated_date}')
                """))
            db.commit()
            print(f"    [OK] 已插入/更新用户数据（1个管理员 + 20个普通用户）")
        else:
            print(f"    [INFO] 用户表已有足够数据（管理员: {admin_count}, 普通用户: {user_count}）")
        
        # 2. 插入航班相关基础数据（需要先有 airlines, airports, routes）
        print("  检查基础数据...")
        
        # 检查 airlines
        airline_count = db.execute(text("SELECT COUNT(*) FROM airlines")).scalar()
        if airline_count == 0:
            print("    插入航空公司数据...")
            for code, name in AIRLINE_NAMES.items():
                db.execute(text(f"""
                    INSERT INTO airlines (airline_code, airline_name, country)
                    VALUES ('{code}', '{name}', '中国')
                """))
            db.commit()
            print(f"      [OK] 已插入 {len(AIRLINE_NAMES)} 个航空公司")
        
        # 检查 airports
        airport_count = db.execute(text("SELECT COUNT(*) FROM airports")).scalar()
        if airport_count == 0:
            print("    插入机场数据...")
            airports_data = [
                ("PEK", "北京首都国际机场", "北京"),
                ("PVG", "上海浦东国际机场", "上海"),
                ("CAN", "广州白云国际机场", "广州"),
                ("SZX", "深圳宝安国际机场", "深圳"),
                ("CTU", "成都双流国际机场", "成都"),
                ("HGH", "杭州萧山国际机场", "杭州"),
                ("XIY", "西安咸阳国际机场", "西安"),
                ("NKG", "南京禄口国际机场", "南京"),
                ("WUH", "武汉天河国际机场", "武汉"),
                ("CKG", "重庆江北国际机场", "重庆"),
            ]
            for code, name, city in airports_data:
                db.execute(text(f"""
                    INSERT INTO airports (airport_code, airport_name, city)
                    VALUES ('{code}', '{name}', '{city}')
                """))
            db.commit()
            print(f"      [OK] 已插入 {len(airports_data)} 个机场")
        
        # 检查 routes
        route_count = db.execute(text("SELECT COUNT(*) FROM routes")).scalar()
        if route_count == 0:
            print("    插入航线数据...")
            # 先检查 routes 表的字段名
            try:
                columns = db.execute(text("SHOW COLUMNS FROM routes")).fetchall()
                col_names = [col[0] for col in columns]
                print(f"      Routes 表字段: {col_names}")
                
                airports = db.execute(text("SELECT airport_code FROM airports")).fetchall()
                airport_codes = [a[0] for a in airports]
                
                routes_created = set()
                for _ in range(30):
                    dep = random.choice(airport_codes)
                    arr = random.choice([a for a in airport_codes if a != dep])
                    route_key = f"{dep}-{arr}"
                    if route_key not in routes_created:
                        routes_created.add(route_key)
                        # 根据实际字段名插入
                        db.execute(text(f"""
                            INSERT INTO routes (departure_airport_code, arrival_airport_code, distance_km)
                            VALUES ('{dep}', '{arr}', {random.randint(500, 3000)})
                        """))
                db.commit()
                print(f"      [OK] 已插入 {len(routes_created)} 条航线")
            except Exception as e:
                print(f"      [ERROR] 插入航线失败: {e}")
                db.rollback()
        
        # 3. 插入航班数据
        print("  插入航班数据...")
        flight_count = db.execute(text("SELECT COUNT(*) FROM flights")).scalar()
        if flight_count == 0:
            routes = db.execute(text("SELECT route_id FROM routes")).fetchall()
            route_ids = [r[0] for r in routes]
            airlines = list(AIRLINE_CODES)
            
            for i, route_id in enumerate(route_ids[:20], 1):
                airline = random.choice(airlines)
                dep_hour = random.randint(6, 22)
                dep_min = random.randint(0, 59)
                arr_hour = (dep_hour + random.randint(1, 4)) % 24
                arr_min = random.randint(0, 59)
                
                db.execute(text(f"""
                    INSERT INTO flights (flight_number, airline_code, route_id, aircraft_type, 
                                        economy_seats, business_seats, first_seats, operating_days, 
                                        status, scheduled_departure_time, scheduled_arrival_time)
                    VALUES ('{airline}{1000+i}', '{airline}', {route_id}, '{random.choice(AIRCRAFT_TYPES)}',
                            {random.choice([120, 150, 180])}, {random.choice([20, 30, 40])}, 
                            {random.choice([8, 10, 12])}, '1111111', 'active',
                            '{dep_hour:02d}:{dep_min:02d}', '{arr_hour:02d}:{arr_min:02d}')
                """))
            db.commit()
            print(f"    [OK] 已插入 20 个航班")
        else:
            print(f"    [INFO] 航班表已有 {flight_count} 条数据，跳过")
        
        # 4. 插入乘客数据
        print("  插入乘客数据...")
        passenger_count = db.execute(text("SELECT COUNT(*) FROM passengers")).scalar()
        if passenger_count == 0:
            for i in range(1, 31):
                name = f"{random.choice(FIRST_NAMES)}{random.choice(LAST_NAMES)}"
                id_card = f"110101199{random.randint(0,9)}{random.randint(1,12):02d}{random.randint(1,28):02d}{i:04d}"
                gender = random.choice(['M', 'F'])
                birthday = date(1990 + random.randint(0, 30), random.randint(1, 12), random.randint(1, 28))
                
                db.execute(text(f"""
                    INSERT INTO passengers (name, id_card, gender, birthday, nationality, contact_phone)
                    VALUES ('{name}', '{id_card}', '{gender}', '{birthday}', '中国', '138{random.randint(10000000,99999999)}')
                """))
            db.commit()
            print(f"    [OK] 已插入 30 个乘客")
        else:
            print(f"    [INFO] 乘客表已有 {passenger_count} 条数据，跳过")
        
        # 5. 插入订单数据
        print("  插入订单数据...")
        order_count = db.execute(text("SELECT COUNT(*) FROM orders")).scalar()
        if order_count == 0:
            users = db.execute(text("SELECT id FROM users WHERE role = 'individual'")).fetchall()
            user_ids = [u[0] for u in users]
            flights = db.execute(text("SELECT flight_id FROM flights")).fetchall()
            flight_ids = [f[0] for f in flights]
            passengers = db.execute(text("SELECT passenger_id FROM passengers")).fetchall()
            passenger_ids = [p[0] for p in passengers]
            
            if not user_ids or not flight_ids or not passenger_ids:
                print(f"    [WARN] 缺少必要数据：用户{len(user_ids)}, 航班{len(flight_ids)}, 乘客{len(passenger_ids)}")
            else:
                statuses = ["pending", "paid", "completed", "cancelled"]
                payment_statuses = ["unpaid", "paid", "refunded"]
                
                for i in range(1, 31):
                    user_id = random.choice(user_ids)
                    order_date = datetime.now() - timedelta(days=random.randint(1, 90))
                    order_date_str = order_date.strftime('%Y-%m-%d %H:%M:%S')
                    
                    total_original = Decimal(random.randint(500, 5000))
                    total_amount = total_original * Decimal("0.9")
                    
                    order_status = random.choice(statuses)
                    payment_status = "paid" if order_status in ["paid", "completed"] else random.choice(["unpaid", "failed"])
                    payment_method = random.choice(["alipay", "wechat", "unionpay"])
                    
                    expired_date = (order_date + timedelta(minutes=30)).strftime('%Y-%m-%d %H:%M:%S')
                    paid_date = (order_date + timedelta(minutes=random.randint(5, 60))).strftime('%Y-%m-%d %H:%M:%S') if payment_status == "paid" else "NULL"
                    
                    order_no = f"ORD{order_date.strftime('%Y%m%d')}{i:04d}"
                    
                    # 插入订单
                    db.execute(text(f"""
                        INSERT INTO orders (order_no, user_id, total_amount, total_amount_original, currency,
                                          payment_method, payment_status, status, created_at, expired_at, updated_at, paid_at)
                        VALUES ('{order_no}', {user_id}, {total_amount}, {total_original}, 'CNY',
                                '{payment_method}', '{payment_status}', '{order_status}', 
                                '{order_date_str}', '{expired_date}', '{order_date_str}', 
                                {f"'{paid_date}'" if paid_date != "NULL" else "NULL"})
                    """))
                    db.flush()
                    
                    # 获取刚插入的订单ID
                    order_id_result = db.execute(text(f"SELECT order_id FROM orders WHERE order_no = '{order_no}'")).fetchone()
                    if order_id_result:
                        order_id = order_id_result[0]
                        flight_id = random.choice(flight_ids)
                        passenger_id = random.choice(passenger_ids)
                        cabin_class = random.choice(["economy", "business", "first"])
                        original_price = Decimal(random.randint(800, 3000))
                        paid_price = original_price * Decimal("0.9")
                        
                        seat = f"{random.randint(1,30)}{random.choice(['A','B','C','D','E','F'])}" if order_status == "paid" else "NULL"
                        check_in = "checked" if order_status == "completed" else "not_checked"
                        ticket_status = "confirmed" if order_status != "cancelled" else "cancelled"
                        user_email = db.execute(text(f"SELECT email FROM users WHERE id = {user_id}")).scalar() or "user@example.com"
                        
                        db.execute(text(f"""
                            INSERT INTO order_items (order_id, flight_id, cabin_class, passenger_id,
                                                    original_price, paid_price, seat_number, check_in_status,
                                                    ticket_status, contact_email)
                            VALUES ({order_id}, {flight_id}, '{cabin_class}', {passenger_id},
                                    {original_price}, {paid_price}, {f"'{seat}'" if seat != "NULL" else "NULL"}, 
                                    '{check_in}', '{ticket_status}', '{user_email}')
                        """))
                
                db.commit()
                print(f"    [OK] 已插入 30 个订单及订单明细")
        else:
            print(f"    [INFO] 订单表已有 {order_count} 条数据，跳过")
        
        # 6. 插入酒店数据
        print("  插入酒店数据...")
        hotel_count = db.query(Hotel).count()
        if hotel_count == 0:
            for i, name in enumerate(HOTEL_NAMES, 1):
                hotel = Hotel(
                    name=f"{random.choice(CITIES)}{name}",
                    city=random.choice(CITIES),
                    address=f"{random.choice(CITIES)}市{random.choice(['朝阳区','海淀区','西城区','东城区'])}某某路{random.randint(1,999)}号",
                    star_rating=random.choice([3, 4, 5]),
                    description=f"位于{random.choice(CITIES)}市中心的豪华酒店，设施完善，服务优质。",
                    phone=f"0{random.randint(10,29)}-{random.randint(10000000,99999999)}",
                    status="active",
                    lowest_price=Decimal(random.randint(200, 800))
                )
                db.add(hotel)
            db.commit()
            print(f"    [OK] 已插入 {len(HOTEL_NAMES)} 个酒店")
        else:
            print(f"    [INFO] 酒店表已有 {hotel_count} 条数据，跳过")
        
        # 7. 插入景点数据
        print("  插入景点数据...")
        spot_count = db.query(ScenicSpot).count()
        if spot_count == 0:
            for name in SCENIC_NAMES:
                city = random.choice(CITIES)
                spot = ScenicSpot(
                    name=name,
                    city=city,
                    address=f"{city}市{random.choice(['东城区','西城区','朝阳区','海淀区'])}某某街{random.randint(1,99)}号",
                    description=f"{name}是{city}市著名的旅游景点，历史悠久，风景优美。",
                    open_time="08:00",
                    close_time="18:00",
                    ticket_price=Decimal(random.randint(50, 200)),
                    status="active"
                )
                db.add(spot)
            db.commit()
            print(f"    [OK] 已插入 {len(SCENIC_NAMES)} 个景点")
        else:
            print(f"    [INFO] 景点表已有 {spot_count} 条数据，跳过")
        
        # 8. 插入通知数据
        print("  插入通知数据...")
        notification_count = db.query(Notification).count()
        if notification_count == 0:
            admin_user = db.query(User).filter(User.role == "admin").first()
            users = db.query(User).filter(User.role == "individual").all()
            
            notifications_data = [
                ("系统维护通知", "系统将于今晚22:00-24:00进行维护，期间可能无法访问，请提前做好准备。", None),
                ("新功能上线", "我们推出了新的航班查询功能，支持实时价格对比，快来体验吧！", None),
                ("优惠活动", "即日起至本月底，所有航班享受9折优惠，数量有限，先到先得！", None),
            ]
            
            for title, content, target_id in notifications_data:
                notification = Notification(
                    title=title,
                    content=content,
                    target_user_id=target_id,
                    created_by=admin_user.id if admin_user else 1,
                    created_at=datetime.now() - timedelta(days=random.randint(1, 7)),
                    is_read=False
                )
                db.add(notification)
            
            # 为部分用户添加个人通知
            for user in random.sample(users, min(5, len(users))):
                notification = Notification(
                    title="订单确认通知",
                    content=f"您的订单已确认，请及时查看订单详情。",
                    target_user_id=user.id,
                    created_by=admin_user.id if admin_user else 1,
                    created_at=datetime.now() - timedelta(days=random.randint(1, 3)),
                    is_read=random.choice([True, False])
                )
                db.add(notification)
            
            db.commit()
            print(f"    [OK] 已插入通知数据")
        else:
            print(f"    [INFO] 通知表已有 {notification_count} 条数据，跳过")
        
        print("\n[SUCCESS] 所有测试数据插入完成！")
        
    except Exception as e:
        print(f"[ERROR] 插入数据失败: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 60)
    print("数据库初始化工具")
    print("=" * 60)
    print()
    create_missing_tables()
    print()
    insert_test_data()
    print()
    print("=" * 60)
    print("初始化完成！")
    print("=" * 60)

