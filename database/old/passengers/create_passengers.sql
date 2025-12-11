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

 Date: 19/11/2025 22:23:36
*/
USE skytrip;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

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

SET FOREIGN_KEY_CHECKS = 1;
