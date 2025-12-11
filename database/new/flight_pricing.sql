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

 Date: 25/11/2025 11:10:24
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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

SET FOREIGN_KEY_CHECKS = 1;
