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

 Date: 27/11/2025 22:10:31
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

SET FOREIGN_KEY_CHECKS = 1;
