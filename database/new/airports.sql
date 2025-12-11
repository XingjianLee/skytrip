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

 Date: 20/11/2025 11:56:43
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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

SET FOREIGN_KEY_CHECKS = 1;
