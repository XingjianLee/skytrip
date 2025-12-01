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

 Date: 27/11/2025 22:10:01
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

SET FOREIGN_KEY_CHECKS = 1;
