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

 Date: 20/11/2025 14:52:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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

SET FOREIGN_KEY_CHECKS = 1;
