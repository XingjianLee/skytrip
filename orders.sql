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

 Date: 19/11/2025 22:23:29
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `order_id` bigint NOT NULL AUTO_INCREMENT,
  `order_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '订单号，如 ORD20251023123456',
  `user_id` bigint NOT NULL COMMENT '下单用户ID',
  `total_amount` decimal(10, 2) NOT NULL COMMENT '实际支付金额（折扣后）',
  `currency` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'CNY',
  `payment_method` enum('alipay','wechat','unionpay','credit_card','offline') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'alipay' COMMENT '支付方式',
  `payment_status` enum('unpaid','paid','refunded','failed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'unpaid',
  `paid_at` datetime NULL DEFAULT NULL COMMENT '实际支付时间',
  `status` enum('pending','paid','cancelled','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'pending',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `expired_at` datetime NULL DEFAULT NULL COMMENT '订单过期时间（如30分钟未支付自动取消）',
  `total_amount_original` decimal(10, 2) NOT NULL COMMENT '订单原价（折扣前）',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`) USING BTREE,
  UNIQUE INDEX `order_no`(`order_no` ASC) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES (1, 'ORD202510230001', 0, 1280.00, 'CNY', 'alipay', 'paid', '2025-10-23 09:30:00', 'paid', '2025-10-23 09:25:00', NULL, 1280.00, '2025-11-07 12:34:17');
INSERT INTO `orders` VALUES (2, 'ORD202510230002', 0, 4560.00, 'CNY', 'wechat', 'paid', '2025-10-23 10:15:22', 'paid', '2025-10-23 10:10:00', NULL, 4800.00, '2025-11-07 12:34:17');
INSERT INTO `orders` VALUES (3, 'ORD202510230003', 0, 890.00, 'CNY', 'unionpay', 'unpaid', NULL, 'pending', '2025-10-23 10:50:00', '2025-10-23 11:20:00', 890.00, '2025-11-07 12:34:17');
INSERT INTO `orders` VALUES (4, 'ORD202510230004', 0, 6200.00, 'CNY', 'offline', 'paid', '2025-10-22 16:40:00', 'completed', '2025-10-22 16:30:00', NULL, 6200.00, '2025-11-07 12:34:17');
INSERT INTO `orders` VALUES (5, 'ORD202510230005', 0, 2100.00, 'CNY', 'credit_card', 'failed', NULL, 'cancelled', '2025-10-23 11:30:00', '2025-10-23 12:00:00', 2100.00, '2025-11-07 12:34:17');
INSERT INTO `orders` VALUES (9, 'ORD20251107045714', 30, 880.00, 'CNY', 'alipay', 'unpaid', NULL, 'pending', '2025-11-07 04:57:15', '2025-11-07 05:27:15', 880.00, '2025-11-07 04:57:15');
INSERT INTO `orders` VALUES (10, 'ORD20251107045905', 30, 880.00, 'CNY', 'alipay', 'unpaid', NULL, 'pending', '2025-11-07 04:59:05', '2025-11-07 05:29:05', 880.00, '2025-11-07 04:59:05');
INSERT INTO `orders` VALUES (11, 'ORD20251112044230', 22, 920.00, 'CNY', 'alipay', 'paid', '2025-11-12 04:58:34', 'paid', '2025-11-12 04:42:31', '2025-11-12 05:12:31', 920.00, '2025-11-12 04:58:34');
INSERT INTO `orders` VALUES (12, 'ORD20251116134539', 22, 960.00, 'CNY', 'alipay', 'unpaid', NULL, 'pending', '2025-11-16 13:45:39', '2025-11-16 14:15:39', 960.00, '2025-11-16 13:45:39');

SET FOREIGN_KEY_CHECKS = 1;
