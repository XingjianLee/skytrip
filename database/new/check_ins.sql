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

 Date: 20/11/2025 11:56:56
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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

SET FOREIGN_KEY_CHECKS = 1;
