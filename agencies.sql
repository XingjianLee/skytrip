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

 Date: 20/11/2025 11:55:54
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

SET FOREIGN_KEY_CHECKS = 1;
