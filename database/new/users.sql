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

 Date: 19/11/2025 22:23:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户昵称',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '邮箱',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `real_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '真实姓名',
  `id_card` char(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '身份证号（用于实名认证与订单关联）',
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像图片URL',
  `bio` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '个人签名/简介',
  `vip_level` tinyint UNSIGNED NULL DEFAULT 0 COMMENT 'VIP等级：0-普通用户，1-银卡，2-金卡，3-白金等',
  `vip_expire_date` date NULL DEFAULT NULL COMMENT 'VIP有效期（可选）',
  `role` enum('individual','agency','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'individual',
  `agency_id` bigint NULL DEFAULT NULL COMMENT '所属旅行社ID（仅旅行社员工非空）',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_issue_date` date NULL DEFAULT NULL COMMENT '身份证签发日期',
  `id_expiry_date` date NULL DEFAULT NULL COMMENT '身份证失效日期',
  `id_issuer` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '身份证签发机关',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `uk_idcard`(`id_card` ASC) USING BTREE,
  UNIQUE INDEX `uk_email`(`email` ASC) USING BTREE,
  UNIQUE INDEX `uk_phone`(`phone` ASC) USING BTREE,
  INDEX `agency_id`(`agency_id` ASC) USING BTREE,
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`agency_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 36 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('testuser_1761309144', '13800003080', 'test_1761309144@example.com', '$2b$12$K8COHavhBqyPxlP168E66u1tcE7tR2tQ3Aa1Bxfr/IaYBDNw4bu9O', '测试用户', '110101199001013080', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 12:32:25', '2025-10-24 12:32:25', 1, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_1761309317', '13800006635', 'test_1761309317@example.com', '$2b$12$KkGZ4Fkubdnp07hO4sYxrubFfjJO2.c62ewofj9cI.pzuiMWhuOI.', '测试用户', '110101199001016635', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 12:35:17', '2025-10-24 12:35:17', 2, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_1761309344', '13800007530', 'test_1761309344@example.com', '$2b$12$wDtCErKkk0CLx54.d7Epl.j9I/FJNfKsFRIC01l.thN59vVz3Twjm', '测试用户', '110101199001017530', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 12:35:45', '2025-10-24 12:35:45', 3, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_1761309408', '13800002419', 'test_1761309408@example.com', '$2b$12$NNbgRo.lmMdyA21kKiT/.uxAF4UY4E6knnjivr4gJZ7DoRgkgdP5y', '测试用户', '110101199001012419', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 12:36:49', '2025-10-24 12:36:49', 4, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_1761309442', '13800004536', 'test_1761309442@example.com', '$2b$12$CxjxysK.dzRZ35YzbSSYsu2ic/GsiQ.9oAjqgj5j2H/XZ/bTa7VZu', '测试用户', '110101199001014536', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 12:37:23', '2025-10-24 12:37:23', 5, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('anonymous_user', '15011112222', NULL, 'guest123', '刘强', '110101198811114567', NULL, '随便看看', 0, NULL, 'individual', NULL, '2025-10-24 20:18:23', '2025-10-24 20:50:32', 6, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('ctrip_staff1', '13600002222', 'xiaomin@ctrip.com', 'ctrip456', '赵小敏', '310115199208083224', '/avatars/zhao.jpg', '携程机票业务专员', 0, NULL, 'agency', 3, '2025-10-24 20:18:23', '2025-10-24 20:50:32', 7, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('kanghui_sichuan', '13700003333', 'zhoutao@kanghui.com', 'kh789', '周涛', '510101198707076789', NULL, '康辉四川分公司', 0, NULL, 'agency', 5, '2025-10-24 20:18:23', '2025-10-24 20:50:32', 8, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('traveler_zhang', '13812345678', 'zhangwei@example.com', '123456', '张伟', '110101199001011234', '/avatars/zhang.jpg', '喜欢探索小众目的地', 0, NULL, 'individual', NULL, '2025-10-24 20:18:23', '2025-10-24 20:50:32', 9, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('user_wang', NULL, 'wangfang@test.com', '111111', '王芳', '110101199212123456', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 20:18:23', '2025-10-24 20:50:32', 10, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('vip_li', '13987654321', 'lina@email.com', 'password', '李娜', '110101198505152345', '/avatars/li.jpg', '飞行常客，年出行10+次', 2, NULL, 'individual', NULL, '2025-10-24 20:18:23', '2025-10-24 20:50:32', 11, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('李济安', '15032717237', '15032717237@163.com', '123456', '李行健', '130104200404250000', '/avatars/li.jpg', '喜欢出行', 2, NULL, 'individual', NULL, '2025-10-24 20:18:23', '2025-10-24 20:50:32', 12, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('陈经理', '13500001111', 'chen@cits.com', '123456', '陈国强', '110101198003035678', '/avatars/chen.jpg', '国旅华北区负责人', 0, NULL, 'agency', 1, '2025-10-24 20:18:23', '2025-10-24 20:50:32', 13, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_1761310343', '13800005102', 'test_1761310343@example.com', '$2b$12$tyNADdmlxeS/he1fx/ftNu1wUvZwoAOMjZQQ0pcNptuq2cSwIt/u6', '测试用户', '110101199001015102', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 12:52:24', '2025-10-24 12:52:24', 14, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('lililili', '13900432752', 'user1@example.com', '$2b$12$gtVolDqBxru4X3.G1Y0RjOyQYgiVHlvdSHH6/3SwPdv69DLwhusRi', 'string', '128692519435769939', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 13:09:22', '2025-10-24 13:09:22', 15, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_1761312907', '13861312907', 'test_1761312907@skytrip.com', '$2b$12$uSCxiYenvrckI89NXTZ2y.sSeMZrWyi/lm0TDSalhA1E622liplve', '测试用户', '110101199001012907', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 13:35:08', '2025-10-24 13:35:08', 16, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('admin', '13800000000', 'duplicate@test.com', '$2b$12$qCNkxgl.zFV.6fLXYw0kUOKlFFo6Exab5GeuUteMScs4YIUmGE1ZC', '重复用户', '110101199001010000', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 13:35:08', '2025-10-24 13:35:08', 17, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_20251024213805', '13800003805', 'test_20251024213805@example.com', '$2b$12$.ekts6w/9yBJO2mKIwdw6u2dAMKgIsDGW7GJoVYU77SpR/kVidl0e', '测试用户', '11010119900101001X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 13:38:05', '2025-10-24 13:38:05', 18, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_20251024220808', '13924220808', 'test_20251024220808@example.com', '$2b$12$.zeMq1.BYmvJ4WtmaaEAY.Swj1bHYlxjZBW.q6BD2TpyMP/SxnsTu', '测试用户', '11010119900101808X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 14:08:09', '2025-10-24 14:08:09', 19, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_20251024220853', '13924220853', 'test_20251024220853@example.com', '$2b$12$3EJvZ5sA1VKeeXbQkoKBv.tK.xBm2y7/jSXZ2hdb09f9bYgw5jrXG', '测试用户', '11010119900101853X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 14:08:54', '2025-10-24 14:08:54', 20, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('testuser_20251024222920', '13924222920', 'test_20251024222920@example.com', '$2b$12$4izzBsR1sdPkWlC9qHHqk.bCBdoY6rMRuY0thoxnR.bRTNZyJcCu2', '测试用户', '11010119900101920X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 14:29:21', '2025-10-24 14:29:21', 21, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('liuzhongwang', '13608393878', 'liwenjundeerzi@qq.com', '$2b$12$nJv3n8zSu9gVDU9cM9L97ea4Wne2fud3KlmLxMHBSqIBkKCkVDMaG', 'gdefrgrewg', '500302922828292922', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-24 14:43:18', '2025-10-24 14:43:18', 22, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('admin1', '13831112033', 'admin_20251031112033@skytrip.com', '$2b$12$iuf24gE/Y0yWBJJwyV95auH9UT.rY.xFEoHpRGTC7KS1zBVrCiNAC', '系统管理员', '11010119800101033X', NULL, NULL, 0, NULL, 'admin', NULL, '2025-10-31 03:20:34', '2025-10-31 11:31:10', 23, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('test_20251031124412', '13931124412', 'test_20251031124412@example.com', '$2b$12$95qI9.OxUpIF9/vveTKQYuUbFYWIYL39h7eJJ6tSv00vNl0QvS2jW', '测试用户', '11010119900101412X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-31 04:44:13', '2025-10-31 04:44:13', 24, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('test_20251031134340', '13931134340', 'test_20251031134340@example.com', '$2b$12$J3NFWrPl5gukuXFDDpZKTu.mxOu6b3dXeNgxfooSL7l3E4q8.RD6K', '测试用户', '11010119900101340X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-31 05:43:40', '2025-10-31 05:43:40', 25, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('test_20251031134429', '13931134429', 'test_20251031134429@example.com', '$2b$12$jYH6rPIpK.JD4eOnmhkIEe6Mi8QfAh.PqSddVp3JTCoSLPeLNyI8q', '测试用户', '11010119900101429X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-10-31 05:44:29', '2025-10-31 05:44:29', 26, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('test_20251104110754', '13904110754', 'test_20251104110754@example.com', '$2b$12$oEnW5LkoaqsXe7zXJeLeN.kgW6jU31W/5JN0YlrRA21qn8ydEZKqG', '测试用户', '11010119900101754X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-04 03:07:55', '2025-11-04 03:07:55', 27, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('test_20251107114644', '13907114644', 'test_20251107114644@example.com', '$2b$12$9jrgpC0PgD/fTlAExEJD0.cF/TbRGTe/6geyGmZ.0ttNuegtBNQE6', '测试用户', '11010119900101644X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-07 03:46:45', '2025-11-07 03:46:45', 28, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('test_20251107123255', '13907123255', 'test_20251107123255@example.com', '$2b$12$qkfqEkGU41xghuA6UBfW0u9UHw.UhEcwyD0Sbun15nC54Pe/Oe/LS', '测试用户', '11010119900101255X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-07 04:32:56', '2025-11-07 04:32:56', 29, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('test_20251107125637', '13907125637', 'test_20251107125637@example.com', '$2b$12$reh/tgTNwXa0bQUeCBXzluJS3yJ/ctf52AJVzSHKMk3o88L8yC4.2', '测试用户', '11010119900101637X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-07 04:56:37', '2025-11-07 04:56:37', 30, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('liuzhongwang2', '15683907725', '3468004006@qq.com', '$2b$12$stRvrS8PY.aKX4AxWy.RE.fsSZ5zJ5ZtNmd9jZ7215og3d/MURNCe', '李汶骏', '500106200808242133', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-07 12:03:25', '2025-11-07 12:03:25', 31, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('guoxuke', '13990009876', '2345667556@qq.com', '$2b$12$HwZIj.ueRGj8orqv3WQi8utpko7T/DAc5aueyDNg0DBd7i2Bpf2Qy', '郭旭科', '200106199904242322', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-07 12:57:58', '2025-11-07 12:57:58', 32, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('zhouzhaogang', '13468393878', '3467004005@qq.com', '$2b$12$Tm.4Ww1LWi8LHOty0eyOC.ejnHrnM6KamsckU/2NVdTpH2ddPea62', '周小孩', '500103200608242133', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-07 13:02:33', '2025-11-07 13:02:33', 33, NULL, NULL, NULL);
INSERT INTO `users` VALUES ('test_20251109182434', '13909182434', 'test_20251109182434@example.com', '$2b$12$ShjP/cMXvc9vMd/dZJdPcOq3xHVJIzaqEZ6fioxZGA9ZCl8EDLBHa', '测试用户', '11010119900101434X', NULL, NULL, 0, NULL, 'individual', NULL, '2025-11-09 10:24:34', '2025-11-09 10:24:34', 34, NULL, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
