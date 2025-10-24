USE skytrip;


CREATE TABLE order_items (
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL COMMENT '所属订单',

    #对应的
    flight_id INT NOT NULL COMMENT '航班ID',
    cabin_class ENUM('economy', 'business', 'first') NOT NULL COMMENT '舱位',
    passenger_id BIGINT NOT NULL COMMENT '乘机人ID,对应passenger',

    original_price DECIMAL(10,2) NOT NULL COMMENT '该机票原价（折扣前）',
    paid_price DECIMAL(10,2) NOT NULL COMMENT '该机票实际支付价格（折扣后）',

    seat_number VARCHAR(10) NULL COMMENT '座位号（值机后分配）',

    #是否值机，是否退票
    check_in_status ENUM('not_checked', 'checked') DEFAULT 'not_checked',
    ticket_status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',

    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
    FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id),

    INDEX idx_order (order_id),
    INDEX idx_passenger (passenger_id)
);


-- 订单1: ORD202510230001 (user_id=1, 普通用户)
-- 张伟 + 王小明 各一张经济舱（原价1200，实付1200）
INSERT INTO order_items (order_id, flight_id, cabin_class, passenger_id, original_price, paid_price) VALUES
(1, 1, 'economy', 1, 1200.00, 1140.00),  -- 李行健 (passenger_id=1)
(1, 1, 'economy', 3, 1200.00, 1140.00);  -- 王小明 (passenger_id=4)