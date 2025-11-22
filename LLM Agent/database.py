import mysql.connector
from mysql.connector import Error
from typing import List, Dict, Any
from config import DB_CONFIG
import logging

logger = logging.getLogger(__name__)


class DatabaseManager:
    def __init__(self):
        self.config = DB_CONFIG

    def get_connection(self):
        """获取数据库连接"""
        try:
            connection = mysql.connector.connect(**self.config)
            return connection
        except Error as e:
            logger.error(f"数据库连接失败: {e}")
            raise

    def get_flights_by_route_and_time(self,
                                      departure_city: str,
                                      arrival_city: str,
                                      departure_date: str,
                                      departure_time_start: str,
                                      departure_time_end: str) -> List[Dict]:
        """
        根据出发地、目的地、日期和时间范围查询航班
        """
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
        SELECT 
            f.flight_id,
            f.flight_number,
            al.airline_name,
            a1.airport_name as departure_airport,
            a1.city as departure_city,
            a2.airport_name as arrival_airport,
            a2.city as arrival_city,
            f.scheduled_departure_time,
            f.scheduled_arrival_time,
            f.aircraft_type,
            fp.base_price as economy_price,
            fp_business.base_price as business_price,
            fp_first.base_price as first_price
        FROM flights f
        JOIN routes r ON f.route_id = r.route_id
        JOIN airports a1 ON r.departure_airport_code = a1.airport_code
        JOIN airports a2 ON r.arrival_airport_code = a2.airport_code
        JOIN flight_pricing fp ON f.flight_id = fp.flight_id AND fp.cabin_class = 'economy'
        LEFT JOIN flight_pricing fp_business ON f.flight_id = fp_business.flight_id AND fp_business.cabin_class = 'business'
        LEFT JOIN flight_pricing fp_first ON f.flight_id = fp_first.flight_id AND fp_first.cabin_class = 'first'
        JOIN airlines al ON f.airline_code = al.airline_code
        WHERE a1.city = %s 
        AND a2.city = %s
        AND DATE(f.scheduled_departure_time) BETWEEN %s AND %s
        AND TIME(f.scheduled_departure_time) BETWEEN %s AND %s
        AND f.status = 'active'
        ORDER BY fp.base_price ASC
        LIMIT 10
        """

        cursor.execute(query, (departure_city, arrival_city, departure_date, departure_date,
                               departure_time_start, departure_time_end))
        results = cursor.fetchall()
        cursor.close()
        connection.close()
        return results

    def get_airport_codes_by_city(self, city: str) -> List[Dict]:
        """根据城市获取机场信息"""
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT airport_code, airport_name FROM airports WHERE city = %s"
        cursor.execute(query, (city,))
        results = cursor.fetchall()
        cursor.close()
        connection.close()
        return results

    def get_available_routes(self) -> List[Dict]:
        """获取所有可用航线"""
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)
        # noinspection SqlDialectInspection
        query = """
        SELECT DISTINCT 
            a1.city as departure_city,
            a2.city as arrival_city
        FROM routes r
        JOIN airports a1 ON r.departure_airport_code = a1.airport_code
        JOIN airports a2 ON r.arrival_airport_code = a2.airport_code
        """
        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()
        connection.close()
        return results

    def get_flights_by_requirement(self,
                                   departure_city: str,
                                   arrival_city: str,
                                   departure_date: str,
                                   departure_time_start: str = "00:00:00",
                                   departure_time_end: str = "23:59:59",
                                   cabin_class: str = "economy",
                                   price_min: float = None,
                                   price_max: float = None,
                                   airline_code: str = None) -> List[Dict]:
        """
        根据完整需求查询航班，支持舱位、价格区间、航空公司筛选
        """
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        # 根据舱位选择对应的价格字段
        price_field_map = {
            "economy": "fp.base_price",
            "business": "fp_business.base_price",
            "first": "fp_first.base_price"
        }
        price_field = price_field_map.get(cabin_class, "fp.base_price")

        query = f"""
        SELECT 
            f.flight_id,
            f.flight_number,
            al.airline_name,
            al.airline_code,
            a1.airport_name as departure_airport,
            a1.city as departure_city,
            a2.airport_name as arrival_airport,
            a2.city as arrival_city,
            f.scheduled_departure_time,
            f.scheduled_arrival_time,
            f.aircraft_type,
            fp.base_price as economy_price,
            COALESCE(fp_business.base_price, 0) as business_price,
            COALESCE(fp_first.base_price, 0) as first_price,
            {price_field} as selected_price
        FROM flights f
        JOIN routes r ON f.route_id = r.route_id
        JOIN airports a1 ON r.departure_airport_code = a1.airport_code
        JOIN airports a2 ON r.arrival_airport_code = a2.airport_code
        JOIN flight_pricing fp ON f.flight_id = fp.flight_id AND fp.cabin_class = 'economy'
        LEFT JOIN flight_pricing fp_business ON f.flight_id = fp_business.flight_id AND fp_business.cabin_class = 'business'
        LEFT JOIN flight_pricing fp_first ON f.flight_id = fp_first.flight_id AND fp_first.cabin_class = 'first'
        JOIN airlines al ON f.airline_code = al.airline_code
        WHERE a1.city = %s 
        AND a2.city = %s
        AND f.scheduled_departure_time BETWEEN %s AND %s
        AND f.status = 'active'
        """

        # scheduled_departure_time是TIME类型，只需要时间范围，不需要日期
        params = [departure_city, arrival_city, departure_time_start, departure_time_end]

        # 添加舱位筛选（确保该舱位有价格）
        if cabin_class == "business":
            query += " AND fp_business.base_price > 0"
        elif cabin_class == "first":
            query += " AND fp_first.base_price > 0"

        # 添加价格区间筛选
        if price_min is not None:
            query += f" AND {price_field} >= %s"
            params.append(price_min)
        if price_max is not None:
            query += f" AND {price_field} <= %s"
            params.append(price_max)

        # 添加航空公司筛选
        if airline_code:
            query += " AND al.airline_code = %s"
            params.append(airline_code)

        # 按选中舱位的价格排序
        query += f" ORDER BY {price_field} ASC LIMIT 20"

        cursor.execute(query, params)
        results = cursor.fetchall()
        cursor.close()
        connection.close()
        return results


    def get_flight_by_id(self, flight_id: int) -> Dict:
        """根据航班ID获取航班信息"""
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT 
            f.flight_id,
            f.flight_number,
            al.airline_name,
            al.airline_code,
            a1.airport_name as departure_airport,
            a1.city as departure_city,
            a2.airport_name as arrival_airport,
            a2.city as arrival_city,
            f.scheduled_departure_time,
            f.scheduled_arrival_time,
            f.aircraft_type,
            f.economy_seats,
            f.business_seats,
            f.first_seats,
            fp.base_price as economy_price,
            COALESCE(fp_business.base_price, 0) as business_price,
            COALESCE(fp_first.base_price, 0) as first_price
        FROM flights f
        JOIN routes r ON f.route_id = r.route_id
        JOIN airports a1 ON r.departure_airport_code = a1.airport_code
        JOIN airports a2 ON r.arrival_airport_code = a2.airport_code
        JOIN flight_pricing fp ON f.flight_id = fp.flight_id AND fp.cabin_class = 'economy'
        LEFT JOIN flight_pricing fp_business ON f.flight_id = fp_business.flight_id AND fp_business.cabin_class = 'business'
        LEFT JOIN flight_pricing fp_first ON f.flight_id = fp_first.flight_id AND fp_first.cabin_class = 'first'
        JOIN airlines al ON f.airline_code = al.airline_code
        WHERE f.flight_id = %s
        """
        cursor.execute(query, (flight_id,))
        result = cursor.fetchone()
        cursor.close()
        connection.close()
        return result
    
    def get_user_by_id(self, user_id: int) -> Dict:
        """根据用户ID获取用户信息"""
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM users WHERE user_id = %s"
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        cursor.close()
        connection.close()
        return result
    
    def get_passenger_by_id_card(self, id_card: str) -> Dict:
        """根据身份证号获取乘客信息"""
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM passengers WHERE id_card = %s"
        cursor.execute(query, (id_card,))
        result = cursor.fetchone()
        cursor.close()
        connection.close()
        return result
    
    def create_passenger(self, name: str, id_card: str, gender: str = None, 
                        birthday: str = None, contact_phone: str = None) -> int:
        """创建乘客信息，返回乘客ID"""
        connection = self.get_connection()
        cursor = connection.cursor()
        query = """
        INSERT INTO passengers (name, id_card, gender, birthday, contact_phone)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (name, id_card, gender, birthday, contact_phone))
        connection.commit()
        passenger_id = cursor.lastrowid
        cursor.close()
        connection.close()
        return passenger_id
    
    def create_order(self, user_id: int, total_amount: float, 
                    total_amount_original: float, payment_method: str = 'alipay') -> Dict:
        """创建订单，返回订单信息"""
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)
        
        # 生成订单号
        from datetime import datetime
        order_no = f"ORD{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        query = """
        INSERT INTO orders (order_no, user_id, total_amount, total_amount_original, 
                          payment_method, payment_status, status)
        VALUES (%s, %s, %s, %s, %s, 'unpaid', 'pending')
        """
        cursor.execute(query, (order_no, user_id, total_amount, total_amount_original, payment_method))
        connection.commit()
        order_id = cursor.lastrowid
        
        # 获取完整订单信息
        query = "SELECT * FROM orders WHERE order_id = %s"
        cursor.execute(query, (order_id,))
        order = cursor.fetchone()
        cursor.close()
        connection.close()
        return order
    
    def create_order_item(self, order_id: int, flight_id: int, cabin_class: str,
                         passenger_id: int, original_price: float, paid_price: float) -> int:
        """创建订单项，返回订单项ID"""
        connection = self.get_connection()
        cursor = connection.cursor()
        query = """
        INSERT INTO order_items (order_id, flight_id, cabin_class, passenger_id, 
                                original_price, paid_price, ticket_status)
        VALUES (%s, %s, %s, %s, %s, %s, 'confirmed')
        """
        cursor.execute(query, (order_id, flight_id, cabin_class, passenger_id, 
                              original_price, paid_price))
        connection.commit()
        item_id = cursor.lastrowid
        cursor.close()
        connection.close()
        return item_id
    
    def get_orders_by_user(self, user_id: int) -> List[Dict]:
        """获取用户的所有订单"""
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT o.*, 
               COUNT(oi.item_id) as item_count
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.user_id = %s
        GROUP BY o.order_id
        ORDER BY o.created_at DESC
        """
        cursor.execute(query, (user_id,))
        results = cursor.fetchall()
        cursor.close()
        connection.close()
        return results
    
    def get_order_items_by_order(self, order_id: int) -> List[Dict]:
        """获取订单的所有订单项"""
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT oi.*, 
               f.flight_number,
               f.scheduled_departure_time,
               f.scheduled_arrival_time,
               a1.city as departure_city,
               a2.city as arrival_city,
               p.name as passenger_name
        FROM order_items oi
        JOIN flights f ON oi.flight_id = f.flight_id
        JOIN routes r ON f.route_id = r.route_id
        JOIN airports a1 ON r.departure_airport_code = a1.airport_code
        JOIN airports a2 ON r.arrival_airport_code = a2.airport_code
        JOIN passengers p ON oi.passenger_id = p.passenger_id
        WHERE oi.order_id = %s
        """
        cursor.execute(query, (order_id,))
        results = cursor.fetchall()
        cursor.close()
        connection.close()
        return results
    
    def create_check_in(self, item_id: int, passenger_id: int, flight_id: int,
                      seat_number: str, terminal: str = None, gate: str = None,
                      boarding_time: str = None) -> int:
        """创建值机记录，返回值机ID"""
        connection = self.get_connection()
        cursor = connection.cursor()
        query = """
        INSERT INTO check_ins (item_id, passenger_id, flight_id, seat_number, 
                              terminal, gate, boarding_time)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (item_id, passenger_id, flight_id, seat_number, 
                              terminal, gate, boarding_time))
        connection.commit()
        check_in_id = cursor.lastrowid
        
        # 更新订单项的值机状态
        update_query = "UPDATE order_items SET check_in_status = 'checked' WHERE item_id = %s"
        cursor.execute(update_query, (item_id,))
        connection.commit()
        
        cursor.close()
        connection.close()
        return check_in_id
    
    def get_check_in_by_item(self, item_id: int) -> Dict:
        """根据订单项ID获取值机信息"""
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM check_ins WHERE item_id = %s"
        cursor.execute(query, (item_id,))
        result = cursor.fetchone()
        cursor.close()
        connection.close()
        return result
    
    def update_order_payment_status(self, order_id: int, payment_status: str, 
                                   payment_method: str = None) -> bool:
        """更新订单支付状态"""
        connection = self.get_connection()
        cursor = connection.cursor()
        
        if payment_status == 'paid':
            from datetime import datetime
            query = """
            UPDATE orders 
            SET payment_status = %s, 
                status = 'paid',
                paid_at = %s
            WHERE order_id = %s
            """
            cursor.execute(query, (payment_status, datetime.now(), order_id))
        else:
            query = "UPDATE orders SET payment_status = %s WHERE order_id = %s"
            cursor.execute(query, (payment_status, order_id))
        
        connection.commit()
        cursor.close()
        connection.close()
        return True


# 全局数据库实例
db_manager = DatabaseManager()