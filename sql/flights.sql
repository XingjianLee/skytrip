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

 Date: 27/11/2025 22:10:06
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

SET FOREIGN_KEY_CHECKS = 1;
