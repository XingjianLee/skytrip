USE skytrip;

#值机表
CREATE TABLE check_ins
(
    check_in_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id       BIGINT      NOT NULL COMMENT '关联 order_items.item_id',
    passenger_id  BIGINT      NOT NULL,
    flight_id     INT         NOT NULL,

    #值机核心信息（用于生成登机牌）
    seat_number   VARCHAR(10) NOT NULL COMMENT '分配的座位号',
    terminal      VARCHAR(10) COMMENT '航站楼，如 T2、T3',
    gate          VARCHAR(10) COMMENT '登机口，如 A12、B05',
    boarding_time DATETIME COMMENT '登机开始时间（通常比起飞时间早30-45分钟）',
    #完成值机时间
    checked_at    DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '值机完成时间',

    FOREIGN KEY (item_id) REFERENCES order_items (item_id) ON DELETE CASCADE,
    FOREIGN KEY (passenger_id) REFERENCES passengers (passenger_id),
    FOREIGN KEY (flight_id) REFERENCES flights (flight_id),

    UNIQUE KEY uk_item (item_id) COMMENT '一张机票只能值机一次',
    INDEX idx_passenger (passenger_id)
);


INSERT INTO check_ins (
    item_id,
    passenger_id,
    flight_id,
    seat_number,
    terminal,
    gate,
    boarding_time,
    checked_at
) VALUES (
    1,                              -- order_items.item_id
    1,                          -- passengers.passenger_id (李行健)
    1,                             -- flights.flight_id
    '15C',                       -- 座位号
    'T3',                            -- 航站楼（北京首都机场T3）
    'C21',                              -- 登机口
    '2025-10-25 07:20:00',       -- 登机开始时间（航班计划08:00起飞）
    '2025-10-24 14:30:22'           -- 值机完成时间
);