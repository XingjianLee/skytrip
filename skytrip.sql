/*
 Navicat Premium Data Transfer

 Source Server         : skytrip
 Source Server Type    : MySQL
 Source Server Version : 80040 (8.0.40)
 Source Host           : localhost:3306
 Source Schema         : skytrip

 Target Server Type    : MySQL
 Target Server Version : 80040 (8.0.40)
 File Encoding         : 65001

 Date: 19/12/2025 09:14:39
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for agencies
-- ----------------------------
DROP TABLE IF EXISTS `agencies`;
CREATE TABLE `agencies`  (
  `agency_id` bigint NOT NULL AUTO_INCREMENT,
  `agency_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '旅行社全称',
  `business_license` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '营业执照注册号',
  `contact_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`agency_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of agencies
-- ----------------------------
INSERT INTO `agencies` VALUES (1, '中国国旅旅行社有限公司', '91110108710927834X', '010-88889999', '北京市东城区东长安街10号');
INSERT INTO `agencies` VALUES (2, '中青旅控股股份有限公司', '91110000101682378Y', '010-65881234', '北京市朝阳区东三环北路19号');
INSERT INTO `agencies` VALUES (3, '携程旅行网（上海携程商务有限公司）', '91310105759554321Z', '021-34068888', '上海市长宁区金钟路968号');
INSERT INTO `agencies` VALUES (4, '飞猪旅行（杭州阿里旅行科技有限公司）', '91330106MA27YK1234', '0571-87218888', '浙江省杭州市余杭区文一西路969号');
INSERT INTO `agencies` VALUES (5, '四川康辉国际旅行社', '91510107734567890A', '028-86753090', '四川省成都市青羊区顺城大街269号');
INSERT INTO `agencies` VALUES (6, '广东南湖国际旅行社', '91440101190456789B', '020-83336666', '广东省广州市越秀区环市东路339号');
INSERT INTO `agencies` VALUES (7, '云南海外国际旅行社', '91530102MA6K12345C', '0871-63168888', '云南省昆明市五华区东风西路156号');
INSERT INTO `agencies` VALUES (8, '北京春秋旅行社', '91110105722654321D', '010-64668888', '北京市朝阳区建国门外大街1号');

-- ----------------------------
-- Table structure for airlines
-- ----------------------------
DROP TABLE IF EXISTS `airlines`;
CREATE TABLE `airlines`  (
  `airline_code` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `airline_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `country` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '中国',
  PRIMARY KEY (`airline_code`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of airlines
-- ----------------------------
INSERT INTO `airlines` VALUES ('3U', '四川航空', '中国');
INSERT INTO `airlines` VALUES ('CA', '中国国际航空', '中国');
INSERT INTO `airlines` VALUES ('CZ', '中国南方航空', '中国');
INSERT INTO `airlines` VALUES ('HU', '海南航空', '中国');
INSERT INTO `airlines` VALUES ('LL', 'string', 'string');
INSERT INTO `airlines` VALUES ('MU', '中国东方航空', '中国');

-- ----------------------------
-- Table structure for airports
-- ----------------------------
DROP TABLE IF EXISTS `airports`;
CREATE TABLE `airports`  (
  `airport_code` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'IATA 机场三字码，如 PEK、CTU',
  `airport_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '机场中文全称',
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '所属城市（中文）',
  `country` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '中国' COMMENT '国家',
  PRIMARY KEY (`airport_code`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of airports
-- ----------------------------
INSERT INTO `airports` VALUES ('CAN', '广州白云国际机场', '广州', '中国');
INSERT INTO `airports` VALUES ('CKG', '重庆江北国际机场', '重庆', '中国');
INSERT INTO `airports` VALUES ('CSX', '长沙黄花国际机场', '长沙', '中国');
INSERT INTO `airports` VALUES ('CTO', '成都双流国际机场', '成都', '中国');
INSERT INTO `airports` VALUES ('CTU', '成都天府国际机场', '成都', '中国');
INSERT INTO `airports` VALUES ('HGH', '杭州萧山国际机场', '杭州', '中国');
INSERT INTO `airports` VALUES ('KMG', '昆明长水国际机场', '昆明', '中国');
INSERT INTO `airports` VALUES ('LHW', '兰州中川国际机场', '兰州', '中国');
INSERT INTO `airports` VALUES ('NKG', '南京禄口国际机场', '南京', '中国');
INSERT INTO `airports` VALUES ('PEK', '北京首都国际机场', '北京', '中国');
INSERT INTO `airports` VALUES ('PKX', '北京大兴国际机场', '北京', '中国');
INSERT INTO `airports` VALUES ('PVG', '上海浦东国际机场', '上海', '中国');
INSERT INTO `airports` VALUES ('SHA', '上海虹桥国际机场', '上海', '中国');
INSERT INTO `airports` VALUES ('SZX', '深圳宝安国际机场', '深圳', '中国');
INSERT INTO `airports` VALUES ('TSN', '天津滨海国际机场', '天津', '中国');
INSERT INTO `airports` VALUES ('URC', '乌鲁木齐地窝堡国际机场', '乌鲁木齐', '中国');
INSERT INTO `airports` VALUES ('WUH', '武汉天河国际机场', '武汉', '中国');
INSERT INTO `airports` VALUES ('XIY', '西安咸阳国际机场', '西安', '中国');

-- ----------------------------
-- Table structure for check_ins
-- ----------------------------
DROP TABLE IF EXISTS `check_ins`;
CREATE TABLE `check_ins`  (
  `check_in_id` bigint NOT NULL AUTO_INCREMENT,
  `item_id` bigint NOT NULL COMMENT '关联 order_items.item_id',
  `passenger_id` bigint NOT NULL,
  `flight_id` int NOT NULL,
  `seat_number` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分配的座位号',
  `terminal` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '航站楼，如 T2、T3',
  `gate` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '登机口，如 A12、B05',
  `boarding_time` datetime NULL DEFAULT NULL COMMENT '登机开始时间（通常比起飞时间早30-45分钟）',
  `checked_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '值机完成时间',
  PRIMARY KEY (`check_in_id`) USING BTREE,
  UNIQUE INDEX `uk_item`(`item_id` ASC) USING BTREE COMMENT '一张机票只能值机一次',
  INDEX `flight_id`(`flight_id` ASC) USING BTREE,
  INDEX `idx_passenger`(`passenger_id` ASC) USING BTREE,
  CONSTRAINT `check_ins_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `order_items` (`item_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `check_ins_ibfk_2` FOREIGN KEY (`passenger_id`) REFERENCES `passengers` (`passenger_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `check_ins_ibfk_3` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`flight_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of check_ins
-- ----------------------------
INSERT INTO `check_ins` VALUES (1, 1, 1, 1, '15C', 'T3', 'C21', '2025-10-25 07:20:00', '2025-10-24 14:30:22');

-- ----------------------------
-- Table structure for flight_pricing
-- ----------------------------
DROP TABLE IF EXISTS `flight_pricing`;
CREATE TABLE `flight_pricing`  (
  `pricing_id` int NOT NULL AUTO_INCREMENT,
  `flight_id` int NOT NULL COMMENT '关联航班',
  `cabin_class` enum('economy','business','first') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '舱位类型',
  `base_price` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '该航司对该航班该舱位的基础定价',
  PRIMARY KEY (`pricing_id`) USING BTREE,
  UNIQUE INDEX `uk_flight_cabin`(`flight_id` ASC, `cabin_class` ASC) USING BTREE,
  CONSTRAINT `flight_pricing_ibfk_1` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`flight_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 49 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of flight_pricing
-- ----------------------------
INSERT INTO `flight_pricing` VALUES (1, 1, 'economy', 950.00);
INSERT INTO `flight_pricing` VALUES (2, 1, 'business', 2200.00);
INSERT INTO `flight_pricing` VALUES (3, 1, 'first', 4200.00);
INSERT INTO `flight_pricing` VALUES (4, 2, 'economy', 920.00);
INSERT INTO `flight_pricing` VALUES (5, 2, 'business', 2150.00);
INSERT INTO `flight_pricing` VALUES (6, 2, 'first', 4100.00);
INSERT INTO `flight_pricing` VALUES (7, 3, 'economy', 960.00);
INSERT INTO `flight_pricing` VALUES (8, 3, 'business', 2100.00);
INSERT INTO `flight_pricing` VALUES (9, 3, 'first', 0.00);
INSERT INTO `flight_pricing` VALUES (10, 4, 'economy', 940.00);
INSERT INTO `flight_pricing` VALUES (11, 4, 'business', 2050.00);
INSERT INTO `flight_pricing` VALUES (12, 4, 'first', 0.00);
INSERT INTO `flight_pricing` VALUES (13, 5, 'economy', 880.00);
INSERT INTO `flight_pricing` VALUES (14, 5, 'business', 2000.00);
INSERT INTO `flight_pricing` VALUES (15, 5, 'first', 0.00);
INSERT INTO `flight_pricing` VALUES (16, 6, 'economy', 860.00);
INSERT INTO `flight_pricing` VALUES (17, 6, 'business', 1950.00);
INSERT INTO `flight_pricing` VALUES (18, 6, 'first', 0.00);
INSERT INTO `flight_pricing` VALUES (19, 7, 'economy', 900.00);
INSERT INTO `flight_pricing` VALUES (20, 7, 'business', 1800.00);
INSERT INTO `flight_pricing` VALUES (21, 7, 'first', 0.00);
INSERT INTO `flight_pricing` VALUES (22, 8, 'economy', 890.00);
INSERT INTO `flight_pricing` VALUES (23, 8, 'business', 1780.00);
INSERT INTO `flight_pricing` VALUES (24, 8, 'first', 0.00);
INSERT INTO `flight_pricing` VALUES (25, 9, 'economy', 750.00);
INSERT INTO `flight_pricing` VALUES (26, 9, 'business', 1700.00);
INSERT INTO `flight_pricing` VALUES (27, 9, 'first', 3800.00);
INSERT INTO `flight_pricing` VALUES (28, 10, 'economy', 740.00);
INSERT INTO `flight_pricing` VALUES (29, 10, 'business', 1680.00);
INSERT INTO `flight_pricing` VALUES (30, 10, 'first', 3750.00);
INSERT INTO `flight_pricing` VALUES (31, 11, 'economy', 2400.00);
INSERT INTO `flight_pricing` VALUES (32, 11, 'business', 5800.00);
INSERT INTO `flight_pricing` VALUES (33, 11, 'first', 11000.00);
INSERT INTO `flight_pricing` VALUES (34, 12, 'economy', 2450.00);
INSERT INTO `flight_pricing` VALUES (35, 12, 'business', 5900.00);
INSERT INTO `flight_pricing` VALUES (36, 12, 'first', 11200.00);
INSERT INTO `flight_pricing` VALUES (37, 13, 'economy', 820.00);
INSERT INTO `flight_pricing` VALUES (38, 13, 'business', 1900.00);
INSERT INTO `flight_pricing` VALUES (39, 13, 'first', 0.00);
INSERT INTO `flight_pricing` VALUES (40, 14, 'economy', 810.00);
INSERT INTO `flight_pricing` VALUES (41, 14, 'business', 1880.00);
INSERT INTO `flight_pricing` VALUES (42, 14, 'first', 0.00);
INSERT INTO `flight_pricing` VALUES (43, 15, 'economy', 650.00);
INSERT INTO `flight_pricing` VALUES (44, 15, 'business', 1500.00);
INSERT INTO `flight_pricing` VALUES (45, 15, 'first', 0.00);
INSERT INTO `flight_pricing` VALUES (46, 16, 'economy', 630.00);
INSERT INTO `flight_pricing` VALUES (47, 16, 'business', 1450.00);
INSERT INTO `flight_pricing` VALUES (48, 16, 'first', 0.00);

-- ----------------------------
-- Table structure for flights
-- ----------------------------
DROP TABLE IF EXISTS `flights`;
CREATE TABLE `flights`  (
  `flight_id` int NOT NULL AUTO_INCREMENT COMMENT '航班唯一ID',
  `flight_number` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '航班号，如 CA1831、MU5102',
  `airline_code` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '所属航空公司代码，引用 airlines 表',
  `route_id` int NOT NULL COMMENT '航线ID，引用 routes 表（含出发/到达机场）',
  `aircraft_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '机型代码，如 B737、A320、A330',
  `economy_seats` int NOT NULL DEFAULT 120,
  `business_seats` int NOT NULL DEFAULT 30,
  `first_seats` int NOT NULL DEFAULT 10,
  `operating_days` varchar(21) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '000000000000000000000',
  `status` enum('active','suspended') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `scheduled_departure_time` time NOT NULL COMMENT '计划起飞时刻（不含日期）',
  `scheduled_arrival_time` time NOT NULL COMMENT '计划到达时刻（不含日期）',
  PRIMARY KEY (`flight_id`) USING BTREE,
  INDEX `airline_code`(`airline_code` ASC) USING BTREE,
  INDEX `idx_route`(`route_id` ASC) USING BTREE,
  CONSTRAINT `flights_ibfk_1` FOREIGN KEY (`airline_code`) REFERENCES `airlines` (`airline_code`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `flights_ibfk_2` FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of flights
-- ----------------------------
INSERT INTO `flights` VALUES (1, 'CA1831', 'CA', 5, 'B737', 120, 24, 8, '111111100000000000000', 'active', '08:00:00', '10:30:00');
INSERT INTO `flights` VALUES (2, 'CA1835', 'CA', 6, 'B737', 120, 24, 8, '111111100000000000000', 'active', '09:20:00', '11:50:00');
INSERT INTO `flights` VALUES (3, 'CZ3901', 'CZ', 7, 'A320', 125, 22, 6, '111110000000000000000', 'active', '10:10:00', '12:50:00');
INSERT INTO `flights` VALUES (4, 'CZ3905', 'CZ', 8, 'A320', 125, 22, 6, '111110000000000000000', 'active', '13:30:00', '16:10:00');
INSERT INTO `flights` VALUES (5, 'MU5302', 'MU', 9, 'A320', 130, 20, 0, '111111111100000000000', 'active', '14:20:00', '16:40:00');
INSERT INTO `flights` VALUES (6, 'MU5312', 'MU', 10, 'A320', 130, 20, 0, '111111100000000000000', 'active', '16:00:00', '18:10:00');
INSERT INTO `flights` VALUES (7, '3U3456', '3U', 13, 'A320', 130, 18, 0, '111111100000000000000', 'active', '08:40:00', '10:50:00');
INSERT INTO `flights` VALUES (8, '3U3466', '3U', 14, 'A320', 130, 18, 0, '111111100000000000000', 'active', '11:20:00', '13:30:00');
INSERT INTO `flights` VALUES (9, 'HU7801', 'HU', 27, 'B737', 115, 24, 8, '111111100000000000000', 'active', '07:10:00', '08:40:00');
INSERT INTO `flights` VALUES (10, 'HU7805', 'HU', 28, 'B737', 115, 24, 8, '111111100000000000000', 'active', '10:00:00', '11:30:00');
INSERT INTO `flights` VALUES (11, 'CA1298', 'CA', 21, 'B777', 250, 40, 12, '111100000000000000000', 'active', '10:00:00', '14:30:00');
INSERT INTO `flights` VALUES (12, 'CA1299', 'CA', 22, 'B777', 250, 40, 12, '111100000000000000000', 'active', '15:20:00', '19:50:00');
INSERT INTO `flights` VALUES (13, 'MU2701', 'MU', 24, 'A320', 130, 20, 0, '111111100000000000000', 'active', '08:30:00', '10:00:00');
INSERT INTO `flights` VALUES (14, 'MU2711', 'MU', 25, 'A320', 130, 20, 0, '111111100000000000000', 'active', '13:10:00', '14:40:00');
INSERT INTO `flights` VALUES (15, '3U3267', '3U', 17, 'A320', 130, 18, 0, '111110000000000000000', 'active', '13:50:00', '16:10:00');
INSERT INTO `flights` VALUES (16, '3U3888', '3U', 26, 'A320', 130, 18, 0, '111111100000000000000', 'active', '07:20:00', '08:30:00');

-- ----------------------------
-- Table structure for order_items
-- ----------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items`  (
  `item_id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL COMMENT '所属订单',
  `flight_id` int NOT NULL COMMENT '航班ID',
  `cabin_class` enum('economy','business','first') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '舱位',
  `passenger_id` bigint NOT NULL COMMENT '乘机人ID,对应passenger',
  `original_price` decimal(10, 2) NOT NULL COMMENT '该机票原价（折扣前）',
  `paid_price` decimal(10, 2) NOT NULL COMMENT '该机票实际支付价格（折扣后）',
  `flight_date` date NULL DEFAULT NULL,
  `seat_number` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '座位号（值机后分配）',
  `check_in_status` enum('not_checked','checked') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'not_checked',
  `ticket_status` enum('confirmed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'confirmed',
  `contact_email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '联系邮箱（统一与订单一致）',
  PRIMARY KEY (`item_id`) USING BTREE,
  INDEX `flight_id`(`flight_id` ASC) USING BTREE,
  INDEX `idx_order`(`order_id` ASC) USING BTREE,
  INDEX `idx_passenger`(`passenger_id` ASC) USING BTREE,
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`flight_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`passenger_id`) REFERENCES `passengers` (`passenger_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_items
-- ----------------------------
INSERT INTO `order_items` VALUES (1, 1, 1, 'economy', 1, 1200.00, 1140.00, NULL, NULL, 'not_checked', 'confirmed', NULL);
INSERT INTO `order_items` VALUES (2, 1, 1, 'economy', 3, 1200.00, 1140.00, NULL, NULL, 'not_checked', 'confirmed', NULL);
INSERT INTO `order_items` VALUES (3, 9, 5, 'economy', 2, 880.00, 880.00, NULL, NULL, 'not_checked', 'confirmed', NULL);
INSERT INTO `order_items` VALUES (4, 10, 5, 'economy', 2, 880.00, 880.00, NULL, NULL, 'not_checked', 'confirmed', NULL);
INSERT INTO `order_items` VALUES (5, 11, 2, 'economy', 8, 920.00, 920.00, NULL, NULL, 'not_checked', 'confirmed', NULL);
INSERT INTO `order_items` VALUES (6, 12, 3, 'economy', 9, 960.00, 960.00, NULL, NULL, 'not_checked', 'confirmed', '3468004006@qq.com');
INSERT INTO `order_items` VALUES (7, 13, 3, 'economy', 10, 940.00, 960.00, '2025-12-20', NULL, 'not_checked', 'confirmed', '2345004006@qq.com');
INSERT INTO `order_items` VALUES (8, 14, 3, 'first', 11, 4100.00, 0.00, '2025-12-18', NULL, 'not_checked', 'confirmed', '3455988330@qq.com');
INSERT INTO `order_items` VALUES (9, 15, 4, 'business', 12, 2050.00, 2050.00, NULL, NULL, 'not_checked', 'confirmed', '3468004006@qq.com');
INSERT INTO `order_items` VALUES (10, 16, 4, 'economy', 13, 940.00, 940.00, NULL, '15D', 'checked', 'confirmed', '3456004006@qq.com');
INSERT INTO `order_items` VALUES (11, 17, 2, 'economy', 12, 920.00, 920.00, NULL, NULL, 'not_checked', 'confirmed', '3468004006@qq.com');
INSERT INTO `order_items` VALUES (12, 18, 1, 'economy', 14, 950.00, 950.00, '2025-12-20', NULL, 'not_checked', 'confirmed', 'test@example.com');

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `order_id` bigint NOT NULL AUTO_INCREMENT,
  `order_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '订单号，如 ORD20251023123456',
  `user_id` bigint NOT NULL COMMENT '下单用户ID',
  `total_amount` decimal(10, 2) NOT NULL COMMENT '实际支付金额（折扣后）',
  `currency` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'CNY',
  `payment_method` enum('alipay','wechat','unionpay','credit_card','offline') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'alipay' COMMENT '支付方式',
  `payment_status` enum('unpaid','paid','refunded','failed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'unpaid',
  `paid_at` datetime NULL DEFAULT NULL COMMENT '实际支付时间',
  `status` enum('pending','paid','cancelled','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'pending',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `expired_at` datetime NULL DEFAULT NULL COMMENT '订单过期时间（如30分钟未支付自动取消）',
  `total_amount_original` decimal(10, 2) NOT NULL COMMENT '订单原价（折扣前）',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`) USING BTREE,
  UNIQUE INDEX `order_no`(`order_no` ASC) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES (1, 'ORD202510230001', 0, 1280.00, 'CNY', 'alipay', 'paid', '2025-10-23 09:30:00', 'paid', '2025-10-23 09:25:00', NULL, 1280.00, '2025-11-07 12:34:17');
INSERT INTO `orders` VALUES (2, 'ORD202510230002', 0, 4560.00, 'CNY', 'wechat', 'paid', '2025-10-23 10:15:22', 'paid', '2025-10-23 10:10:00', NULL, 4800.00, '2025-11-07 12:34:17');
INSERT INTO `orders` VALUES (3, 'ORD202510230003', 0, 890.00, 'CNY', 'unionpay', 'unpaid', NULL, 'pending', '2025-10-23 10:50:00', '2025-10-23 11:20:00', 890.00, '2025-11-07 12:34:17');
INSERT INTO `orders` VALUES (4, 'ORD202510230004', 0, 6200.00, 'CNY', 'offline', 'paid', '2025-10-22 16:40:00', 'completed', '2025-10-22 16:30:00', NULL, 6200.00, '2025-11-07 12:34:17');
INSERT INTO `orders` VALUES (5, 'ORD202510230005', 0, 2100.00, 'CNY', 'credit_card', 'failed', NULL, 'cancelled', '2025-10-23 11:30:00', '2025-10-23 12:00:00', 2100.00, '2025-11-07 12:34:17');
INSERT INTO `orders` VALUES (9, 'ORD20251107045714', 30, 880.00, 'CNY', 'alipay', 'unpaid', NULL, 'pending', '2025-11-07 04:57:15', '2025-11-07 05:27:15', 880.00, '2025-11-07 04:57:15');
INSERT INTO `orders` VALUES (10, 'ORD20251107045905', 30, 880.00, 'CNY', 'alipay', 'unpaid', NULL, 'pending', '2025-11-07 04:59:05', '2025-11-07 05:29:05', 880.00, '2025-11-07 04:59:05');
INSERT INTO `orders` VALUES (11, 'ORD20251112044230', 22, 920.00, 'CNY', 'alipay', 'paid', '2025-11-12 04:58:34', 'paid', '2025-11-12 04:42:31', '2025-11-12 05:12:31', 920.00, '2025-11-12 04:58:34');
INSERT INTO `orders` VALUES (12, 'ORD20251116134539', 22, 960.00, 'CNY', 'alipay', 'unpaid', NULL, 'pending', '2025-11-16 13:45:39', '2025-11-16 14:15:39', 960.00, '2025-11-16 13:45:39');
INSERT INTO `orders` VALUES (13, 'ORD20251119145543', 31, 960.00, 'CNY', 'alipay', 'paid', '2025-12-09 03:55:12', 'paid', '2025-11-19 14:55:44', '2025-11-19 15:25:44', 940.00, '2025-12-17 17:14:44');
INSERT INTO `orders` VALUES (14, 'ORD20251120075254', 31, 0.00, 'CNY', 'alipay', 'paid', '2025-12-09 03:52:16', 'paid', '2025-11-20 15:52:54', '2025-11-20 08:22:54', 4100.00, '2025-12-17 16:59:46');
INSERT INTO `orders` VALUES (15, 'ORD20251125055544', 31, 2050.00, 'CNY', 'alipay', 'paid', '2025-11-25 07:39:40', 'paid', '2025-11-25 13:55:44', '2025-11-25 06:25:45', 2050.00, '2025-11-25 15:39:40');
INSERT INTO `orders` VALUES (16, 'ORD20251125061417', 31, 940.00, 'CNY', 'alipay', 'paid', '2025-11-25 07:37:41', 'paid', '2025-11-25 14:14:17', '2025-11-25 06:44:17', 940.00, '2025-11-25 15:37:41');
INSERT INTO `orders` VALUES (17, 'ORD20251211093115', 31, 920.00, 'CNY', 'alipay', 'paid', '2025-12-11 09:31:30', 'paid', '2025-12-11 17:31:15', '2025-12-11 10:01:16', 920.00, '2025-12-11 17:31:30');
INSERT INTO `orders` VALUES (18, 'ORD20251216090306', 6, 950.00, 'CNY', 'alipay', 'unpaid', NULL, 'pending', '2025-12-16 17:03:06', '2025-12-16 09:33:06', 950.00, '2025-12-16 17:03:06');

-- ----------------------------
-- Table structure for passengers
-- ----------------------------
DROP TABLE IF EXISTS `passengers`;
CREATE TABLE `passengers`  (
  `passenger_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id_card` char(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `gender` enum('M','F','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '性别',
  `birthday` date NULL DEFAULT NULL COMMENT '出生日期',
  `nationality` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '中国',
  `contact_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '乘机人联系电话（可选）',
  PRIMARY KEY (`passenger_id`) USING BTREE,
  UNIQUE INDEX `uk_passenger`(`id_card` ASC, `name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of passengers
-- ----------------------------
INSERT INTO `passengers` VALUES (1, '李行健', '130104200404250000', 'M', '2004-04-25', '中国', '15032717237');
INSERT INTO `passengers` VALUES (2, '张伟', '110101199001011234', 'M', '1990-01-01', '中国', '13812345678');
INSERT INTO `passengers` VALUES (3, '李娜', '110101198505152345', 'F', '1985-05-15', '中国', '13987654321');
INSERT INTO `passengers` VALUES (4, '王小明', '110101199503124567', 'M', '1995-03-12', '中国', '15011112222');
INSERT INTO `passengers` VALUES (5, '刘小雨', '110101201508201234', 'F', '2015-08-20', '中国', NULL);
INSERT INTO `passengers` VALUES (6, '陈国强', '110101198003035678', 'M', '1980-03-03', '中国', '13500001111');
INSERT INTO `passengers` VALUES (7, '张丽', '110101199210108888', 'F', '1992-10-10', '中国', '13812348888');
INSERT INTO `passengers` VALUES (8, 'string', '458172366063758747', 'M', '2025-11-12', '中国', '19483200632');
INSERT INTO `passengers` VALUES (9, '李文军', '500106200408242133', NULL, NULL, '中国', '13608393878');
INSERT INTO `passengers` VALUES (10, '刘中网', '500106200432984033', NULL, NULL, '中国', '13458393878');
INSERT INTO `passengers` VALUES (11, '少爷', '500106200406232133', NULL, NULL, '中国', '13602234567');
INSERT INTO `passengers` VALUES (12, '李汶骏', '500106200408242133', NULL, NULL, '中国', '13608393878');
INSERT INTO `passengers` VALUES (13, '李行健', '500106200305242133', NULL, NULL, '中国', '15683807725');
INSERT INTO `passengers` VALUES (14, '测试乘客', '11010519491231002X', NULL, NULL, '中国', '13800138000');

-- ----------------------------
-- Table structure for routes
-- ----------------------------
DROP TABLE IF EXISTS `routes`;
CREATE TABLE `routes`  (
  `route_id` int NOT NULL AUTO_INCREMENT COMMENT '航线唯一ID',
  `departure_airport_code` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '出发机场三字码',
  `arrival_airport_code` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '到达机场三字码',
  `distance_km` int NULL DEFAULT NULL COMMENT '航程距离（公里）',
  PRIMARY KEY (`route_id`) USING BTREE,
  UNIQUE INDEX `uk_route`(`departure_airport_code` ASC, `arrival_airport_code` ASC) USING BTREE,
  INDEX `idx_departure`(`departure_airport_code` ASC) USING BTREE,
  INDEX `idx_arrival`(`arrival_airport_code` ASC) USING BTREE,
  CONSTRAINT `routes_ibfk_1` FOREIGN KEY (`departure_airport_code`) REFERENCES `airports` (`airport_code`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `routes_ibfk_2` FOREIGN KEY (`arrival_airport_code`) REFERENCES `airports` (`airport_code`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of routes
-- ----------------------------
INSERT INTO `routes` VALUES (1, 'PEK', 'PVG', 1080);
INSERT INTO `routes` VALUES (2, 'PEK', 'SHA', 1050);
INSERT INTO `routes` VALUES (3, 'PKX', 'PVG', 1100);
INSERT INTO `routes` VALUES (4, 'PKX', 'SHA', 1070);
INSERT INTO `routes` VALUES (5, 'PEK', 'CTU', 1550);
INSERT INTO `routes` VALUES (6, 'PEK', 'CTO', 1520);
INSERT INTO `routes` VALUES (7, 'PKX', 'CTU', 1560);
INSERT INTO `routes` VALUES (8, 'PKX', 'CTO', 1530);
INSERT INTO `routes` VALUES (9, 'PVG', 'CAN', 1200);
INSERT INTO `routes` VALUES (10, 'SHA', 'CAN', 1180);
INSERT INTO `routes` VALUES (11, 'PVG', 'SZX', 1250);
INSERT INTO `routes` VALUES (12, 'SHA', 'SZX', 1230);
INSERT INTO `routes` VALUES (13, 'CTU', 'CAN', 1250);
INSERT INTO `routes` VALUES (14, 'CTO', 'CAN', 1240);
INSERT INTO `routes` VALUES (15, 'XIY', 'PVG', 1300);
INSERT INTO `routes` VALUES (16, 'XIY', 'SHA', 1280);
INSERT INTO `routes` VALUES (17, 'CKG', 'NKG', 1400);
INSERT INTO `routes` VALUES (18, 'KMG', 'HGH', 2100);
INSERT INTO `routes` VALUES (19, 'TSN', 'CTU', 1400);
INSERT INTO `routes` VALUES (20, 'TSN', 'CTO', 1380);
INSERT INTO `routes` VALUES (21, 'URC', 'PEK', 2800);
INSERT INTO `routes` VALUES (22, 'URC', 'PKX', 2820);
INSERT INTO `routes` VALUES (23, 'LHW', 'SZX', 1600);
INSERT INTO `routes` VALUES (24, 'WUH', 'PVG', 850);
INSERT INTO `routes` VALUES (25, 'WUH', 'SHA', 830);
INSERT INTO `routes` VALUES (26, 'CSX', 'CAN', 600);
INSERT INTO `routes` VALUES (27, 'XIY', 'CTU', 750);
INSERT INTO `routes` VALUES (28, 'XIY', 'CTO', 730);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户昵称',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '邮箱',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `real_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '真实姓名',
  `id_card` char(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '身份证号（用于实名认证与订单关联）',
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像图片URL',
  `bio` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '个人签名/简介',
  `vip_level` tinyint UNSIGNED NULL DEFAULT 0 COMMENT 'VIP等级：0-普通用户，1-银卡，2-金卡，3-白金等',
  `vip_expire_date` date NULL DEFAULT NULL COMMENT 'VIP有效期（可选）',
  `role` enum('individual','agency','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'individual',
  `agency_id` bigint NULL DEFAULT NULL COMMENT '所属旅行社ID（仅旅行社员工非空）',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_issue_date` date NULL DEFAULT NULL COMMENT '身份证签发日期',
  `id_expiry_date` date NULL DEFAULT NULL COMMENT '身份证失效日期',
  `id_issuer` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '身份证签发机关',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `uk_idcard`(`id_card` ASC) USING BTREE,
  UNIQUE INDEX `uk_email`(`email` ASC) USING BTREE,
  UNIQUE INDEX `uk_phone`(`phone` ASC) USING BTREE,
  INDEX `agency_id`(`agency_id` ASC) USING BTREE,
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`agency_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 39 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('testuser_1761309144', '13800003080', 'test_1761309144@example.com', '$2b$12$K8COHavhBqyPxlP168E66u1tcE7tR2tQ3Aa1Bxfr/IaYBDNw4bu9O', '测试用户', '110101199001013080', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 12:32:25', '2025-10-24 12:32:25', 1, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_1761309317', '13800006635', 'test_1761309317@example.com', '$2b$12$KkGZ4Fkubdnp07hO4sYxrubFfjJO2.c62ewofj9cI.pzuiMWhuOI.', '测试用户', '110101199001016635', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 12:35:17', '2025-10-24 12:35:17', 2, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_1761309344', '13800007530', 'test_1761309344@example.com', '$2b$12$wDtCErKkk0CLx54.d7Epl.j9I/FJNfKsFRIC01l.thN59vVz3Twjm', '测试用户', '110101199001017530', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 12:35:45', '2025-10-24 12:35:45', 3, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_1761309408', '13800002419', 'test_1761309408@example.com', '$2b$12$NNbgRo.lmMdyA21kKiT/.uxAF4UY4E6knnjivr4gJZ7DoRgkgdP5y', '测试用户', '110101199001012419', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 12:36:49', '2025-10-24 12:36:49', 4, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_1761309442', '13800004536', 'test_1761309442@example.com', '$2b$12$CxjxysK.dzRZ35YzbSSYsu2ic/GsiQ.9oAjqgj5j2H/XZ/bTa7VZu', '测试用户', '110101199001014536', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 12:37:23', '2025-10-24 12:37:23', 5, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('anonymous_user', '13800000001', NULL, 'guest123', '????X', '110101198811114567', NULL, '随便看看', 0, NULL, 'individual', NULL, '2025-10-24 20:18:23', '2025-11-25 11:59:00', 6, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('ctrip_staff1', '13600002222', 'xiaomin@ctrip.com', 'ctrip456', '赵小敏', '310115199208083224', '/avatars/zhao.jpg', '携程机票业务专员', 0, NULL, 'agency', 3, '2025-10-24 20:18:23', '2025-10-24 20:50:32', 7, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('kanghui_sichuan', '13700003333', 'zhoutao@kanghui.com', 'kh789', '周涛', '510101198707076789', NULL, '康辉四川分公司', 0, NULL, 'agency', 5, '2025-10-24 20:18:23', '2025-10-24 20:50:32', 8, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('traveler_zhang', '13812345678', 'zhangwei@example.com', '123456', '张伟', '110101199001011234', '/avatars/zhang.jpg', '喜欢探索小众目的地', 0, NULL, 'individual', NULL, '2025-10-24 20:18:23', '2025-10-24 20:50:32', 9, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('user_wang', NULL, 'wangfang@test.com', '111111', '王芳', '110101199212123456', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 20:18:23', '2025-10-24 20:50:32', 10, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('vip_li', '13987654321', 'lina@email.com', 'password', '李娜', '110101198505152345', '/avatars/li.jpg', '飞行常客，年出行10+次', 2, NULL, 'individual', NULL, '2025-10-24 20:18:23', '2025-10-24 20:50:32', 11, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('李济安', '15032717237', '15032717237@163.com', '123456', '李行健', '130104200404250000', '/avatars/li.jpg', '喜欢出行', 2, NULL, 'individual', NULL, '2025-10-24 20:18:23', '2025-10-24 20:50:32', 12, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('陈经理', '13500001111', 'chen@cits.com', '123456', '陈国强', '110101198003035678', '/avatars/chen.jpg', '国旅华北区负责人', 0, NULL, 'agency', 1, '2025-10-24 20:18:23', '2025-10-24 20:50:32', 13, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_1761310343', '13800005102', 'test_1761310343@example.com', '$2b$12$tyNADdmlxeS/he1fx/ftNu1wUvZwoAOMjZQQ0pcNptuq2cSwIt/u6', '测试用户', '110101199001015102', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 12:52:24', '2025-10-24 12:52:24', 14, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('lililili', '13900432752', 'user1@example.com', '$2b$12$gtVolDqBxru4X3.G1Y0RjOyQYgiVHlvdSHH6/3SwPdv69DLwhusRi', 'string', '128692519435769939', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 13:09:22', '2025-10-24 13:09:22', 15, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_1761312907', '13861312907', 'test_1761312907@skytrip.com', '$2b$12$uSCxiYenvrckI89NXTZ2y.sSeMZrWyi/lm0TDSalhA1E622liplve', '测试用户', '110101199001012907', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 13:35:08', '2025-10-24 13:35:08', 16, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('admin', '13800000000', 'duplicate@test.com', '$2b$12$qCNkxgl.zFV.6fLXYw0kUOKlFFo6Exab5GeuUteMScs4YIUmGE1ZC', '重复用户', '110101199001010000', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 13:35:08', '2025-10-24 13:35:08', 17, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_20251024213805', '13800003805', 'test_20251024213805@example.com', '$2b$12$.ekts6w/9yBJO2mKIwdw6u2dAMKgIsDGW7GJoVYU77SpR/kVidl0e', '测试用户', '11010119900101001X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 13:38:05', '2025-10-24 13:38:05', 18, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_20251024220808', '13924220808', 'test_20251024220808@example.com', '$2b$12$.zeMq1.BYmvJ4WtmaaEAY.Swj1bHYlxjZBW.q6BD2TpyMP/SxnsTu', '测试用户', '11010119900101808X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 14:08:09', '2025-10-24 14:08:09', 19, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_20251024220853', '13924220853', 'test_20251024220853@example.com', '$2b$12$3EJvZ5sA1VKeeXbQkoKBv.tK.xBm2y7/jSXZ2hdb09f9bYgw5jrXG', '测试用户', '11010119900101853X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 14:08:54', '2025-10-24 14:08:54', 20, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_20251024222920', '13924222920', 'test_20251024222920@example.com', '$2b$12$4izzBsR1sdPkWlC9qHHqk.bCBdoY6rMRuY0thoxnR.bRTNZyJcCu2', '测试用户', '11010119900101920X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 14:29:21', '2025-10-24 14:29:21', 21, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('liuzhongwang', '13608398888', 'liwenjundeerzi@qq.com', '$2b$12$nJv3n8zSu9gVDU9cM9L97ea4Wne2fud3KlmLxMHBSqIBkKCkVDMaG', 'gdefrgrewg', '500302922828292922', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 14:43:18', '2025-11-25 13:11:48', 22, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('admin1', '13831112033', 'admin_20251031112033@skytrip.com', '$2b$12$iuf24gE/Y0yWBJJwyV95auH9UT.rY.xFEoHpRGTC7KS1zBVrCiNAC', '系统管理员', '11010119800101033X', NULL, NULL, 0, NULL, 'admin', NULL, '2025-10-31 03:20:34', '2025-10-31 11:31:10', 23, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('test_20251031124412', '13931124412', 'test_20251031124412@example.com', '$2b$12$95qI9.OxUpIF9/vveTKQYuUbFYWIYL39h7eJJ6tSv00vNl0QvS2jW', '测试用户', '11010119900101412X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-31 04:44:13', '2025-10-31 04:44:13', 24, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('test_20251031134340', '13931134340', 'test_20251031134340@example.com', '$2b$12$J3NFWrPl5gukuXFDDpZKTu.mxOu6b3dXeNgxfooSL7l3E4q8.RD6K', '测试用户', '11010119900101340X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-31 05:43:40', '2025-10-31 05:43:40', 25, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('test_20251031134429', '13931134429', 'test_20251031134429@example.com', '$2b$12$jYH6rPIpK.JD4eOnmhkIEe6Mi8QfAh.PqSddVp3JTCoSLPeLNyI8q', '测试用户', '11010119900101429X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-31 05:44:29', '2025-10-31 05:44:29', 26, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('test_20251104110754', '13904110754', 'test_20251104110754@example.com', '$2b$12$oEnW5LkoaqsXe7zXJeLeN.kgW6jU31W/5JN0YlrRA21qn8ydEZKqG', '测试用户', '11010119900101754X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-04 03:07:55', '2025-11-04 03:07:55', 27, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('test_20251107114644', '13907114644', 'test_20251107114644@example.com', '$2b$12$9jrgpC0PgD/fTlAExEJD0.cF/TbRGTe/6geyGmZ.0ttNuegtBNQE6', '测试用户', '11010119900101644X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-07 03:46:45', '2025-11-07 03:46:45', 28, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('test_20251107123255', '13907123255', 'test_20251107123255@example.com', '$2b$12$qkfqEkGU41xghuA6UBfW0u9UHw.UhEcwyD0Sbun15nC54Pe/Oe/LS', '测试用户', '11010119900101255X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-07 04:32:56', '2025-11-07 04:32:56', 29, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('test_20251107125637', '13907125637', 'test_20251107125637@example.com', '$2b$12$reh/tgTNwXa0bQUeCBXzluJS3yJ/ctf52AJVzSHKMk3o88L8yC4.2', '测试用户', '11010119900101637X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-07 04:56:37', '2025-11-07 04:56:37', 30, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('liuzhongwang2', '15683907725', '3468004006@qq.com', '$2b$12$NSIYZN1HYSNG4QS8OoCAMuuZ.ps0CyQrpOL4FMWcjsn72LKtiiUKS', '李汶骏', '500106200808242133', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-07 12:03:25', '2025-12-09 21:28:06', 31, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('guoxuke', '13990009876', '2345667556@qq.com', '$2b$12$HwZIj.ueRGj8orqv3WQi8utpko7T/DAc5aueyDNg0DBd7i2Bpf2Qy', '郭旭科', '200106199904242322', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-07 12:57:58', '2025-11-07 12:57:58', 32, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('zhouzhaogang', '13468393878', '3467004005@qq.com', '$2b$12$Tm.4Ww1LWi8LHOty0eyOC.ejnHrnM6KamsckU/2NVdTpH2ddPea62', '周小孩', '500103200608242133', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-07 13:02:33', '2025-11-07 13:02:33', 33, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('test_20251109182434', '13909182434', 'test_20251109182434@example.com', '$2b$12$ShjP/cMXvc9vMd/dZJdPcOq3xHVJIzaqEZ6fioxZGA9ZCl8EDLBHa', '测试用户', '11010119900101434X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-09 10:24:34', '2025-11-09 10:24:34', 34, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('string', 'string', 'user@example.com', '$2b$12$QX5c2EhSRGeB4.4dZI9xRei3AUOygz6h62najHhC5Uak7zBlW/LX6', 'string', 'string', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-20 14:19:44', '2025-11-20 14:19:44', 36, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('lllll', '13456734567', '35235426436@qq.com', '$2b$12$0jglM18VPce13csY5BhFPeroitQP3Qpl56NBPZzkxYW5X0MJHeE9a', 'veggferg', '500203955849387733', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-20 14:32:29', '2025-11-20 14:32:29', 37, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('violet', '13608888888', '3466666668@qq.com', '$2b$12$O17DB/ouJ30Nd0x0vjEqh.ex/4ZobpW9utu1UKyAYcNzg4nllIhVO', 'violet', '500106200405242133', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-20 15:07:33', '2025-11-20 15:41:36', 38, NULL, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
