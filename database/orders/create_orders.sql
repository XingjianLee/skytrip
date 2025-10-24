USE skytrip;

#订单主表
CREATE TABLE orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(32) UNIQUE NOT NULL COMMENT '订单号，如 ORD20251023123456',

    user_id BIGINT NOT NULL COMMENT '下单用户ID',
    total_amount DECIMAL(10,2) NOT NULL,
    currency CHAR(3) DEFAULT 'CNY',

    #支付相关字段
    payment_method ENUM('alipay', 'wechat', 'unionpay', 'credit_card', 'offline') DEFAULT 'alipay' COMMENT '支付方式',
    payment_status ENUM('unpaid', 'paid', 'refunded', 'failed') DEFAULT 'unpaid',
    paid_at DATETIME NULL COMMENT '实际支付时间',

    #订单状态（可与支付状态联动）
    status ENUM('pending', 'paid', 'cancelled', 'completed') DEFAULT 'pending',

    #时间控制
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expired_at DATETIME NULL COMMENT '订单过期时间（如30分钟未支付自动取消）',

    #外键
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
ALTER TABLE orders
    ADD COLUMN total_amount_original DECIMAL(10,2) NOT NULL COMMENT '订单原价（折扣前）',
    MODIFY COLUMN total_amount DECIMAL(10,2) NOT NULL COMMENT '实际支付金额（折扣后）';


INSERT INTO orders (
    order_no, user_id, total_amount_original, total_amount, currency,
    payment_method, payment_status, status,
    paid_at, expired_at, created_at
) VALUES
('ORD202510230001', 1, 1280.00, 1280.00, 'CNY', 'alipay', 'paid', 'paid', '2025-10-23 09:30:00', NULL, '2025-10-23 09:25:00'),
('ORD202510230002', 2, 4800.00, 4560.00, 'CNY', 'wechat', 'paid', 'paid', '2025-10-23 10:15:22', NULL, '2025-10-23 10:10:00'),
('ORD202510230003', 1, 890.00, 890.00, 'CNY', 'unionpay', 'unpaid', 'pending', NULL, '2025-10-23 11:20:00', '2025-10-23 10:50:00'),
('ORD202510230004', 6, 6200.00, 6200.00, 'CNY', 'offline', 'paid', 'completed', '2025-10-22 16:40:00', NULL, '2025-10-22 16:30:00'),
('ORD202510230005', 2, 2100.00, 2100.00, 'CNY', 'credit_card', 'failed', 'cancelled', NULL, '2025-10-23 12:00:00', '2025-10-23 11:30:00');