CREATE DATABASE skytrip;
USE skytrip;

USE skytrip;
# 创建航空公司表


# airline_code 两字符主键 航空公司二字代码，如 CA、MU、CZ 国际航空运输协会（IATA）代码
# airline_name 航空公司全称
# country 所属国家，默认中国

CREATE TABLE airlines (
    airline_code CHAR(2) PRIMARY KEY,
    airline_name VARCHAR(100) NOT NULL,
    country VARCHAR(50) DEFAULT '中国'
);

INSERT INTO airlines (airline_code, airline_name) VALUES
('CA', '中国国际航空'),
('MU', '中国东方航空'),
('CZ', '中国南方航空'),
('HU', '海南航空'),
('3U', '四川航空');

USE skytrip;

# 创建机场表
CREATE TABLE airports (
    airport_code CHAR(3) PRIMARY KEY COMMENT 'IATA 机场三字码，如 PEK、CTU',
    airport_name VARCHAR(100) NOT NULL COMMENT '机场中文全称',
    city VARCHAR(50) NOT NULL COMMENT '所属城市（中文）',
    country VARCHAR(50) DEFAULT '中国' COMMENT '国家'
);

INSERT INTO airports (airport_code, airport_name, city) VALUES
('PEK', '北京首都国际机场', '北京'),
('PKX', '北京大兴国际机场', '北京'),
('PVG', '上海浦东国际机场', '上海'),
('SHA', '上海虹桥国际机场', '上海'),
('CTU', '成都天府国际机场', '成都'),
('CTO', '成都双流国际机场', '成都'),
('CAN', '广州白云国际机场', '广州'),
('SZX', '深圳宝安国际机场', '深圳'),
('XIY', '西安咸阳国际机场', '西安'),
('CKG', '重庆江北国际机场', '重庆'),
('KMG', '昆明长水国际机场', '昆明'),
('HGH', '杭州萧山国际机场', '杭州'),
('NKG', '南京禄口国际机场', '南京'),
('TSN', '天津滨海国际机场', '天津'),
('URC', '乌鲁木齐地窝堡国际机场', '乌鲁木齐'),
('LHW', '兰州中川国际机场', '兰州'),
('WUH', '武汉天河国际机场', '武汉'),
('CSX', '长沙黄花国际机场', '长沙');

USE skytrip;

# 创建航线表（基于airports表）
CREATE TABLE routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '航线唯一ID',
    departure_airport_code CHAR(3) NOT NULL COMMENT '出发机场三字码',
    arrival_airport_code CHAR(3) NOT NULL COMMENT '到达机场三字码',
    distance_km INT COMMENT '航程距离（公里）',

    #唯一约束：同一对机场只能有一条航线记录
    UNIQUE KEY uk_route (departure_airport_code, arrival_airport_code),
    #外键约束
    FOREIGN KEY (departure_airport_code) REFERENCES airports(airport_code) ON DELETE RESTRICT,
    FOREIGN KEY (arrival_airport_code) REFERENCES airports(airport_code) ON DELETE RESTRICT,
    #索引优化查询（如“从 PEK 出发的所有航线”）
    INDEX idx_departure (departure_airport_code),
    INDEX idx_arrival (arrival_airport_code)
);


INSERT INTO routes (departure_airport_code, arrival_airport_code, distance_km) VALUES
('PEK', 'PVG', 1080),
('PEK', 'SHA', 1050),
('PKX', 'PVG', 1100),
('PKX', 'SHA', 1070),
('PEK', 'CTU', 1550),
('PEK', 'CTO', 1520),
('PKX', 'CTU', 1560),
('PKX', 'CTO', 1530),
('PVG', 'CAN', 1200),
('SHA', 'CAN', 1180),
('PVG', 'SZX', 1250),
('SHA', 'SZX', 1230),
('CTU', 'CAN', 1250),
('CTO', 'CAN', 1240),
('XIY', 'PVG', 1300),
('XIY', 'SHA', 1280),
('CKG', 'NKG', 1400),
('KMG', 'HGH', 2100),
('TSN', 'CTU', 1400),
('TSN', 'CTO', 1380),
('URC', 'PEK', 2800),
('URC', 'PKX', 2820),
('LHW', 'SZX', 1600),
('WUH', 'PVG', 850),
('WUH', 'SHA', 830),
('CSX', 'CAN', 600),
('XIY', 'CTU', 750),
('XIY', 'CTO', 730);

USE skytrip;

CREATE TABLE flights (
    flight_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '航班唯一ID',
    flight_number VARCHAR(10) NOT NULL COMMENT '航班号，如 CA1831、MU5102',

    airline_code CHAR(2) NOT NULL COMMENT '所属航空公司代码，引用 airlines 表',
    route_id INT NOT NULL COMMENT '航线ID，引用 routes 表（含出发/到达机场）',

    scheduled_departure_time TIME NOT NULL COMMENT '计划起飞时间（如 08:00:00）',
    scheduled_arrival_time TIME NOT NULL COMMENT '计划到达时间（如 10:30:00）',

    aircraft_type VARCHAR(20) COMMENT '机型代码，如 B737、A320、A330',

    # 舱位信息
    economy_seats INT NOT NULL DEFAULT 120,
    business_seats INT NOT NULL DEFAULT 30,
    first_seats INT NOT NULL DEFAULT 10,

    operating_days VARCHAR(7) DEFAULT '1111111',
    status ENUM('active', 'suspended') DEFAULT 'active',

    FOREIGN KEY (airline_code) REFERENCES airlines(airline_code),
    FOREIGN KEY (route_id) REFERENCES routes(route_id),
    INDEX idx_route (route_id)
);

INSERT INTO flights (
    flight_number, airline_code, route_id,
    scheduled_departure_time, scheduled_arrival_time,
    aircraft_type,
    economy_seats, business_seats, first_seats,
    operating_days, status
) VALUES
-- 1. PEK → CTU (国航)
('CA1831', 'CA', (SELECT route_id FROM routes WHERE departure_airport_code='PEK' AND arrival_airport_code='CTU'),
 '08:00:00', '10:30:00', 'B737', 120, 24, 8, '1111111', 'active'),

-- 2. PEK → CTO (国航返程双流)
('CA1835', 'CA', (SELECT route_id FROM routes WHERE departure_airport_code='PEK' AND arrival_airport_code='CTO'),
 '09:20:00', '11:50:00', 'B737', 120, 24, 8, '1111111', 'active'),

-- 3. PKX → CTU (南航大兴出发)
('CZ3901', 'CZ', (SELECT route_id FROM routes WHERE departure_airport_code='PKX' AND arrival_airport_code='CTU'),
 '10:10:00', '12:50:00', 'A320', 125, 22, 6, '1111100', 'active'),

-- 4. PKX → CTO (南航到双流)
('CZ3905', 'CZ', (SELECT route_id FROM routes WHERE departure_airport_code='PKX' AND arrival_airport_code='CTO'),
 '13:30:00', '16:10:00', 'A320', 125, 22, 6, '1111100', 'active'),

-- 5. PVG → CAN (东航)
('MU5302', 'MU', (SELECT route_id FROM routes WHERE departure_airport_code='PVG' AND arrival_airport_code='CAN'),
 '14:20:00', '16:40:00', 'A320', 130, 20, 0, '1111111', 'active'),

-- 6. SHA → CAN (东航虹桥出发)
('MU5312', 'MU', (SELECT route_id FROM routes WHERE departure_airport_code='SHA' AND arrival_airport_code='CAN'),
 '16:00:00', '18:10:00', 'A320', 130, 20, 0, '1111111', 'active'),

-- 7. CTU → CAN (川航成都天府出发)
('3U3456', '3U', (SELECT route_id FROM routes WHERE departure_airport_code='CTU' AND arrival_airport_code='CAN'),
 '08:40:00', '10:50:00', 'A320', 130, 18, 0, '1111111', 'active'),

-- 8. CTO → CAN (川航双流出发)
('3U3466', '3U', (SELECT route_id FROM routes WHERE departure_airport_code='CTO' AND arrival_airport_code='CAN'),
 '11:20:00', '13:30:00', 'A320', 130, 18, 0, '1111111', 'active'),

-- 9. XIY → CTU (西部快线)
('HU7801', 'HU', (SELECT route_id FROM routes WHERE departure_airport_code='XIY' AND arrival_airport_code='CTU'),
 '07:10:00', '08:40:00', 'B737', 115, 24, 8, '1111111', 'active'),

-- 10. XIY → CTO
('HU7805', 'HU', (SELECT route_id FROM routes WHERE departure_airport_code='XIY' AND arrival_airport_code='CTO'),
 '10:00:00', '11:30:00', 'B737', 115, 24, 8, '1111111', 'active'),

-- 11. URC → PEK (国航远程)
('CA1298', 'CA', (SELECT route_id FROM routes WHERE departure_airport_code='URC' AND arrival_airport_code='PEK'),
 '10:00:00', '14:30:00', 'B777', 250, 40, 12, '1111000', 'active'),

-- 12. URC → PKX
('CA1299', 'CA', (SELECT route_id FROM routes WHERE departure_airport_code='URC' AND arrival_airport_code='PKX'),
 '15:20:00', '19:50:00', 'B777', 250, 40, 12, '1111000', 'active'),

-- 13. WUH → PVG (东航武汉线)
('MU2701', 'MU', (SELECT route_id FROM routes WHERE departure_airport_code='WUH' AND arrival_airport_code='PVG'),
 '08:30:00', '10:00:00', 'A320', 130, 20, 0, '1111111', 'active'),

-- 14. WUH → SHA
('MU2711', 'MU', (SELECT route_id FROM routes WHERE departure_airport_code='WUH' AND arrival_airport_code='SHA'),
 '13:10:00', '14:40:00', 'A320', 130, 20, 0, '1111111', 'active'),

-- 15. CKG → NKG (川航)
('3U3267', '3U', (SELECT route_id FROM routes WHERE departure_airport_code='CKG' AND arrival_airport_code='NKG'),
 '13:50:00', '16:10:00', 'A320', 130, 18, 0, '1111100', 'active'),

-- 16. CSX → CAN (川航长沙线)
('3U3888', '3U', (SELECT route_id FROM routes WHERE departure_airport_code='CSX' AND arrival_airport_code='CAN'),
 '07:20:00', '08:30:00', 'A320', 130, 18, 0, '1111111', 'active');


USE skytrip;

# 航司定价策略，关联航班，航班关联航司和航线、机型等因素
CREATE TABLE flight_pricing (
    pricing_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL COMMENT '关联航班',
    # 外键关联航班
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE,

    cabin_class ENUM('economy', 'business', 'first') NOT NULL COMMENT '舱位类型',
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '该航司对该航班该舱位的基础定价',
    #唯一性约束：一个航班每个舱位只能有一个有效基础价（简化）
    UNIQUE KEY uk_flight_cabin (flight_id, cabin_class)

);


INSERT INTO flight_pricing (flight_id, cabin_class, base_price) VALUES
-- 航班 1: CA1831 (PEK→CTU)
(1, 'economy', 950.00),
(1, 'business', 2200.00),
(1, 'first', 4200.00),

-- 航班 2: CA1835 (PEK→CTO)
(2, 'economy', 920.00),
(2, 'business', 2150.00),
(2, 'first', 4100.00),

-- 航班 3: CZ3901 (PKX→CTU)
(3, 'economy', 960.00),
(3, 'business', 2100.00),
(3, 'first', 0.00),  -- 南航A320无头等舱

-- 航班 4: CZ3905 (PKX→CTO)
(4, 'economy', 940.00),
(4, 'business', 2050.00),
(4, 'first', 0.00),

-- 航班 5: MU5302 (PVG→CAN)
(5, 'economy', 880.00),
(5, 'business', 2000.00),
(5, 'first', 0.00),  -- 东航A320无头等舱

-- 航班 6: MU5312 (SHA→CAN)
(6, 'economy', 860.00),
(6, 'business', 1950.00),
(6, 'first', 0.00),

-- 航班 7: 3U3456 (CTU→CAN)
(7, 'economy', 900.00),
(7, 'business', 1800.00),
(7, 'first', 0.00),  -- 川航无头等舱

-- 航班 8: 3U3466 (CTO→CAN)
(8, 'economy', 890.00),
(8, 'business', 1780.00),
(8, 'first', 0.00),

-- 航班 9: HU7801 (XIY→CTU)
(9, 'economy', 750.00),
(9, 'business', 1700.00),
(9, 'first', 3800.00),  -- 海航B737有头等舱

-- 航班 10: HU7805 (XIY→CTO)
(10, 'economy', 740.00),
(10, 'business', 1680.00),
(10, 'first', 3750.00),

-- 航班 11: CA1298 (URC→PEK) - 宽体机
(11, 'economy', 2400.00),
(11, 'business', 5800.00),
(11, 'first', 11000.00),

-- 航班 12: CA1299 (URC→PKX)
(12, 'economy', 2450.00),
(12, 'business', 5900.00),
(12, 'first', 11200.00),

-- 航班 13: MU2701 (WUH→PVG)
(13, 'economy', 820.00),
(13, 'business', 1900.00),
(13, 'first', 0.00),

-- 航班 14: MU2711 (WUH→SHA)
(14, 'economy', 810.00),
(14, 'business', 1880.00),
(14, 'first', 0.00),

-- 航班 15: 3U3267 (CKG→NKG)
(15, 'economy', 650.00),
(15, 'business', 1500.00),
(15, 'first', 0.00),

-- 航班 16: 3U3888 (CSX→CAN)
(16, 'economy', 630.00),
(16, 'business', 1450.00),
(16, 'first', 0.00);

USE skytrip;

# 创建旅行社表，存储旅行社信息
CREATE TABLE agencies (
    agency_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agency_name VARCHAR(100) NOT NULL COMMENT '旅行社全称',
    business_license VARCHAR(50) UNIQUE NOT NULL COMMENT '营业执照注册号',
    contact_phone VARCHAR(20),
    address VARCHAR(255)
);

INSERT INTO agencies (agency_name, business_license, contact_phone, address) VALUES
('中国国旅旅行社有限公司', '91110108710927834X', '010-88889999', '北京市东城区东长安街10号'),
('中青旅控股股份有限公司', '91110000101682378Y', '010-65881234', '北京市朝阳区东三环北路19号'),
('携程旅行网（上海携程商务有限公司）', '91310105759554321Z', '021-34068888', '上海市长宁区金钟路968号'),
('飞猪旅行（杭州阿里旅行科技有限公司）', '91330106MA27YK1234', '0571-87218888', '浙江省杭州市余杭区文一西路969号'),
('四川康辉国际旅行社', '91510107734567890A', '028-86753090', '四川省成都市青羊区顺城大街269号'),
('广东南湖国际旅行社', '91440101190456789B', '020-83336666', '广东省广州市越秀区环市东路339号'),
('云南海外国际旅行社', '91530102MA6K12345C', '0871-63168888', '云南省昆明市五华区东风西路156号'),
('北京春秋旅行社', '91110105722654321D', '010-64668888', '北京市朝阳区建国门外大街1号');

USE skytrip;

#创建用户表，对于个人用户和旅行社人员采用同一个表
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '账户昵称',

    #联系方式
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    #密码，暂时明文
    password VARCHAR(100) NOT NULL COMMENT '密码',

    #基础身份信息（所有用户必填）
    real_name VARCHAR(50) NOT NULL COMMENT '真实姓名',
    id_card CHAR(18) NOT NULL COMMENT '身份证号（用于实名认证与订单关联）',
    #个人资料（增强用户体验）图片这里可以不使用
    avatar_url VARCHAR(255) COMMENT '头像图片URL',
    bio VARCHAR(200) COMMENT '个人签名/简介',
    #会员体系
    vip_level TINYINT UNSIGNED DEFAULT 0 COMMENT 'VIP等级：0-普通用户，1-银卡，2-金卡，3-白金等',
    vip_expire_date DATE NULL COMMENT 'VIP有效期（可选）',
    #角色与组织归属
    role ENUM('individual', 'agency') NOT NULL DEFAULT 'individual',
    agency_id BIGINT NULL COMMENT '所属旅行社ID（仅旅行社员工非空）',

    #约束
    UNIQUE KEY uk_idcard (id_card),          -- 身份证全局唯一（自然人唯一）
    UNIQUE KEY uk_email (email),             -- 邮箱唯一（若允许邮箱登录）
    UNIQUE KEY uk_phone (phone),             -- 手机号唯一（若允许手机登录）
    FOREIGN KEY (agency_id) REFERENCES agencies(agency_id) ON DELETE SET NULL
);

ALTER TABLE users
MODIFY COLUMN role ENUM('individual', 'agency', 'admin') NOT NULL DEFAULT 'individual';



-- 个人用户（普通旅客）
INSERT INTO users (username, password, real_name, id_card, phone, email, avatar_url, bio, vip_level, role) VALUES
('李济安', '123456', '李行健', '130104200404250000', '15032717237', '15032717237@163.com', '/avatars/li.jpg', '喜欢出行', 2, 'individual'),
('traveler_zhang', '123456', '张伟', '110101199001011234', '13812345678', 'zhangwei@example.com', '/avatars/zhang.jpg', '喜欢探索小众目的地', 0, 'individual'),
('vip_li', 'password', '李娜', '110101198505152345', '13987654321', 'lina@email.com', '/avatars/li.jpg', '飞行常客，年出行10+次', 2, 'individual'),
('user_wang', '111111', '王芳', '110101199212123456', NULL, 'wangfang@test.com', NULL, NULL, 0, 'individual'),
('anonymous_user', 'guest123', '刘强', '110101198811114567', '15011112222', NULL, NULL, '随便看看', 0, 'individual');


INSERT INTO users (username, password, real_name, id_card, phone, email, avatar_url, bio, role, agency_id) VALUES
('陈经理', '123456', '陈国强', '110101198003035678', '13500001111', 'chen@cits.com', '/avatars/chen.jpg', '国旅华北区负责人', 'agency', 1),
('ctrip_staff1', 'ctrip456', '赵小敏', '310115199208083224', '13600002222', 'xiaomin@ctrip.com', '/avatars/zhao.jpg', '携程机票业务专员', 'agency', 3),
('kanghui_sichuan', 'kh789', '周涛', '510101198707076789', '13700003333', 'zhoutao@kanghui.com', NULL, '康辉四川分公司', 'agency', 5);

USE skytrip;

#创建乘客表，不管是否注册了应用只要和订单有关就是乘客
CREATE TABLE passengers (
    passenger_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    id_card CHAR(18) NOT NULL,
    gender ENUM('M', 'F', 'N') COMMENT '性别',
    birthday DATE COMMENT '出生日期',
    nationality VARCHAR(50) DEFAULT '中国',
    contact_phone VARCHAR(20) COMMENT '乘机人联系电话（可选）',

    #唯一性约束：确保同一身份证+姓名视为同一人
    UNIQUE KEY uk_passenger (id_card, name)
);


INSERT INTO passengers (name, id_card, gender, birthday, nationality, contact_phone) VALUES
('李行健', '130104200404250000', 'M', '2004-04-25', '中国', '15032717237'),
('张伟', '110101199001011234', 'M', '1990-01-01', '中国', '13812345678'),
('李娜', '110101198505152345', 'F', '1985-05-15', '中国', '13987654321'),
('王小明', '110101199503124567', 'M', '1995-03-12', '中国', '15011112222'),
('刘小雨', '110101201508201234', 'F', '2015-08-20', '中国', NULL),
('陈国强', '110101198003035678', 'M', '1980-03-03', '中国', '13500001111'),
('张丽', '110101199210108888', 'F', '1992-10-10', '中国', '13812348888');

USE skytrip;

#订单主表
CREATE TABLE orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(32) UNIQUE NOT NULL COMMENT '订单号，如 ORD20251023123456',

    user_id BIGINT NOT NULL COMMENT '下单用户ID',
    total_amount DECIMAL(10,2) NOT NULL,
    currency CHAR(3) DEFAULT 'CNY',

    #支付相关字段
    payment_method ENUM('alipay', 'wechat', 'unionpay', 'credit_card', 'offline') DEFAULT 'alipay' COMMENT '支付方式',
    payment_status ENUM('unpaid', 'paid', 'refunded', 'failed') DEFAULT 'unpaid',
    paid_at DATETIME NULL COMMENT '实际支付时间',

    #订单状态（可与支付状态联动）
    status ENUM('pending', 'paid', 'cancelled', 'completed') DEFAULT 'pending',

    #时间控制
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expired_at DATETIME NULL COMMENT '订单过期时间（如30分钟未支付自动取消）',

    #外键
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
ALTER TABLE orders
    ADD COLUMN total_amount_original DECIMAL(10,2) NOT NULL COMMENT '订单原价（折扣前）',
    MODIFY COLUMN total_amount DECIMAL(10,2) NOT NULL COMMENT '实际支付金额（折扣后）';


INSERT INTO orders (
    order_no, user_id, total_amount_original, total_amount, currency,
    payment_method, payment_status, status,
    paid_at, expired_at, created_at
) VALUES
('ORD202510230001', 1, 1280.00, 1280.00, 'CNY', 'alipay', 'paid', 'paid', '2025-10-23 09:30:00', NULL, '2025-10-23 09:25:00'),
('ORD202510230002', 2, 4800.00, 4560.00, 'CNY', 'wechat', 'paid', 'paid', '2025-10-23 10:15:22', NULL, '2025-10-23 10:10:00'),
('ORD202510230003', 1, 890.00, 890.00, 'CNY', 'unionpay', 'unpaid', 'pending', NULL, '2025-10-23 11:20:00', '2025-10-23 10:50:00'),
('ORD202510230004', 6, 6200.00, 6200.00, 'CNY', 'offline', 'paid', 'completed', '2025-10-22 16:40:00', NULL, '2025-10-22 16:30:00'),
('ORD202510230005', 2, 2100.00, 2100.00, 'CNY', 'credit_card', 'failed', 'cancelled', NULL, '2025-10-23 12:00:00', '2025-10-23 11:30:00');

USE skytrip;


CREATE TABLE order_items (
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL COMMENT '所属订单',

    #对应的
    flight_id INT NOT NULL COMMENT '航班ID',
    cabin_class ENUM('economy', 'business', 'first') NOT NULL COMMENT '舱位',
    passenger_id BIGINT NOT NULL COMMENT '乘机人ID,对应passenger',

    original_price DECIMAL(10,2) NOT NULL COMMENT '该机票原价（折扣前）',
    paid_price DECIMAL(10,2) NOT NULL COMMENT '该机票实际支付价格（折扣后）',

    seat_number VARCHAR(10) NULL COMMENT '座位号（值机后分配）',

    #是否值机，是否退票
    check_in_status ENUM('not_checked', 'checked') DEFAULT 'not_checked',
    ticket_status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',

    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
    FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id),

    INDEX idx_order (order_id),
    INDEX idx_passenger (passenger_id)
);


-- 订单1: ORD202510230001 (user_id=1, 普通用户)
-- 张伟 + 王小明 各一张经济舱（原价1200，实付1200）
INSERT INTO order_items (order_id, flight_id, cabin_class, passenger_id, original_price, paid_price) VALUES
(1, 1, 'economy', 1, 1200.00, 1140.00),  -- 李行健 (passenger_id=1)
(1, 1, 'economy', 3, 1200.00, 1140.00);  -- 王小明 (passenger_id=4)

USE skytrip;

#值机表
CREATE TABLE check_ins
(
    check_in_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id       BIGINT      NOT NULL COMMENT '关联 order_items.item_id',
    passenger_id  BIGINT      NOT NULL,
    flight_id     INT         NOT NULL,

    #值机核心信息（用于生成登机牌）
    seat_number   VARCHAR(10) NOT NULL COMMENT '分配的座位号',
    terminal      VARCHAR(10) COMMENT '航站楼，如 T2、T3',
    gate          VARCHAR(10) COMMENT '登机口，如 A12、B05',
    boarding_time DATETIME COMMENT '登机开始时间（通常比起飞时间早30-45分钟）',
    #完成值机时间
    checked_at    DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '值机完成时间',

    FOREIGN KEY (item_id) REFERENCES order_items (item_id) ON DELETE CASCADE,
    FOREIGN KEY (passenger_id) REFERENCES passengers (passenger_id),
    FOREIGN KEY (flight_id) REFERENCES flights (flight_id),

    UNIQUE KEY uk_item (item_id) COMMENT '一张机票只能值机一次',
    INDEX idx_passenger (passenger_id)
);


INSERT INTO check_ins (
    item_id,
    passenger_id,
    flight_id,
    seat_number,
    terminal,
    gate,
    boarding_time,
    checked_at
) VALUES (
    1,                              -- order_items.item_id
    1,                          -- passengers.passenger_id (李行健)
    1,                             -- flights.flight_id
    '15C',                       -- 座位号
    'T3',                            -- 航站楼（北京首都机场T3）
    'C21',                              -- 登机口
    '2025-10-25 07:20:00',       -- 登机开始时间（航班计划08:00起飞）
    '2025-10-24 14:30:22'           -- 值机完成时间
);