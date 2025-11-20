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

 Date: 19/11/2025 22:22:47
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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

SET FOREIGN_KEY_CHECKS = 1;
