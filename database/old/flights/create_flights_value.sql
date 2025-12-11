USE skytrip;

# 航司定价策略，关联航班，航班关联航司和航线、机型等因素
CREATE TABLE flight_pricing (
    pricing_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL COMMENT '关联航班',
    # 外键关联航班
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE,

    cabin_class ENUM('economy', 'business', 'first') NOT NULL COMMENT '舱位类型',
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '该航司对该航班该舱位的基础定价',
    #唯一性约束：一个航班每个舱位只能有一个有效基础价（简化）
    UNIQUE KEY uk_flight_cabin (flight_id, cabin_class)

);


INSERT INTO flight_pricing (flight_id, cabin_class, base_price) VALUES
-- 航班 1: CA1831 (PEK→CTU)
(1, 'economy', 950.00),
(1, 'business', 2200.00),
(1, 'first', 4200.00),

-- 航班 2: CA1835 (PEK→CTO)
(2, 'economy', 920.00),
(2, 'business', 2150.00),
(2, 'first', 4100.00),

-- 航班 3: CZ3901 (PKX→CTU)
(3, 'economy', 960.00),
(3, 'business', 2100.00),
(3, 'first', 0.00),  -- 南航A320无头等舱

-- 航班 4: CZ3905 (PKX→CTO)
(4, 'economy', 940.00),
(4, 'business', 2050.00),
(4, 'first', 0.00),

-- 航班 5: MU5302 (PVG→CAN)
(5, 'economy', 880.00),
(5, 'business', 2000.00),
(5, 'first', 0.00),  -- 东航A320无头等舱

-- 航班 6: MU5312 (SHA→CAN)
(6, 'economy', 860.00),
(6, 'business', 1950.00),
(6, 'first', 0.00),

-- 航班 7: 3U3456 (CTU→CAN)
(7, 'economy', 900.00),
(7, 'business', 1800.00),
(7, 'first', 0.00),  -- 川航无头等舱

-- 航班 8: 3U3466 (CTO→CAN)
(8, 'economy', 890.00),
(8, 'business', 1780.00),
(8, 'first', 0.00),

-- 航班 9: HU7801 (XIY→CTU)
(9, 'economy', 750.00),
(9, 'business', 1700.00),
(9, 'first', 3800.00),  -- 海航B737有头等舱

-- 航班 10: HU7805 (XIY→CTO)
(10, 'economy', 740.00),
(10, 'business', 1680.00),
(10, 'first', 3750.00),

-- 航班 11: CA1298 (URC→PEK) - 宽体机
(11, 'economy', 2400.00),
(11, 'business', 5800.00),
(11, 'first', 11000.00),

-- 航班 12: CA1299 (URC→PKX)
(12, 'economy', 2450.00),
(12, 'business', 5900.00),
(12, 'first', 11200.00),

-- 航班 13: MU2701 (WUH→PVG)
(13, 'economy', 820.00),
(13, 'business', 1900.00),
(13, 'first', 0.00),

-- 航班 14: MU2711 (WUH→SHA)
(14, 'economy', 810.00),
(14, 'business', 1880.00),
(14, 'first', 0.00),

-- 航班 15: 3U3267 (CKG→NKG)
(15, 'economy', 650.00),
(15, 'business', 1500.00),
(15, 'first', 0.00),

-- 航班 16: 3U3888 (CSX→CAN)
(16, 'economy', 630.00),
(16, 'business', 1450.00),
(16, 'first', 0.00);