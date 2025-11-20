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

 Date: 19/11/2025 22:23:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for order_items
-- ----------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items`  (
  `item_id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL COMMENT '所属订单',
  `flight_id` int NOT NULL COMMENT '航班ID',
  `cabin_class` enum('economy','business','first') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '舱位',
  `passenger_id` bigint NOT NULL COMMENT '乘机人ID,对应passenger',
  `original_price` decimal(10, 2) NOT NULL COMMENT '该机票原价（折扣前）',
  `paid_price` decimal(10, 2) NOT NULL COMMENT '该机票实际支付价格（折扣后）',
  `seat_number` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '座位号（值机后分配）',
  `check_in_status` enum('not_checked','checked') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'not_checked',
  `ticket_status` enum('confirmed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'confirmed',
  `contact_email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '联系邮箱（统一与订单一致）',
  PRIMARY KEY (`item_id`) USING BTREE,
  INDEX `flight_id`(`flight_id` ASC) USING BTREE,
  INDEX `idx_order`(`order_id` ASC) USING BTREE,
  INDEX `idx_passenger`(`passenger_id` ASC) USING BTREE,
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`flight_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`passenger_id`) REFERENCES `passengers` (`passenger_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_items
-- ----------------------------
INSERT INTO `order_items` VALUES (1, 1, 1, 'economy', 1, 1200.00, 1140.00, NULL, 'not_checked', 'confirmed', NULL);
INSERT INTO `order_items` VALUES (2, 1, 1, 'economy', 3, 1200.00, 1140.00, NULL, 'not_checked', 'confirmed', NULL);
INSERT INTO `order_items` VALUES (3, 9, 5, 'economy', 2, 880.00, 880.00, NULL, 'not_checked', 'confirmed', NULL);
INSERT INTO `order_items` VALUES (4, 10, 5, 'economy', 2, 880.00, 880.00, NULL, 'not_checked', 'confirmed', NULL);
INSERT INTO `order_items` VALUES (5, 11, 2, 'economy', 8, 920.00, 920.00, NULL, 'not_checked', 'confirmed', NULL);
INSERT INTO `order_items` VALUES (6, 12, 3, 'economy', 9, 960.00, 960.00, NULL, 'not_checked', 'confirmed', '3468004006@qq.com');

SET FOREIGN_KEY_CHECKS = 1;
