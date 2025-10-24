USE skytrip;

# 创建航线表（基于airports表）
CREATE TABLE routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '航线唯一ID',
    departure_airport_code CHAR(3) NOT NULL COMMENT '出发机场三字码',
    arrival_airport_code CHAR(3) NOT NULL COMMENT '到达机场三字码',
    distance_km INT COMMENT '航程距离（公里）',

    #唯一约束：同一对机场只能有一条航线记录
    UNIQUE KEY uk_route (departure_airport_code, arrival_airport_code),
    #外键约束
    FOREIGN KEY (departure_airport_code) REFERENCES airports(airport_code) ON DELETE RESTRICT,
    FOREIGN KEY (arrival_airport_code) REFERENCES airports(airport_code) ON DELETE RESTRICT,
    #索引优化查询（如“从 PEK 出发的所有航线”）
    INDEX idx_departure (departure_airport_code),
    INDEX idx_arrival (arrival_airport_code)
);


INSERT INTO routes (departure_airport_code, arrival_airport_code, distance_km) VALUES
('PEK', 'PVG', 1080),
('PEK', 'SHA', 1050),
('PKX', 'PVG', 1100),
('PKX', 'SHA', 1070),
('PEK', 'CTU', 1550),
('PEK', 'CTO', 1520),
('PKX', 'CTU', 1560),
('PKX', 'CTO', 1530),
('PVG', 'CAN', 1200),
('SHA', 'CAN', 1180),
('PVG', 'SZX', 1250),
('SHA', 'SZX', 1230),
('CTU', 'CAN', 1250),
('CTO', 'CAN', 1240),
('XIY', 'PVG', 1300),
('XIY', 'SHA', 1280),
('CKG', 'NKG', 1400),
('KMG', 'HGH', 2100),
('TSN', 'CTU', 1400),
('TSN', 'CTO', 1380),
('URC', 'PEK', 2800),
('URC', 'PKX', 2820),
('LHW', 'SZX', 1600),
('WUH', 'PVG', 850),
('WUH', 'SHA', 830),
('CSX', 'CAN', 600),
('XIY', 'CTU', 750),
('XIY', 'CTO', 730);