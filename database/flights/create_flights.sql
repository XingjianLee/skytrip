USE skytrip;

CREATE TABLE flights (
    flight_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '航班唯一ID',
    flight_number VARCHAR(10) NOT NULL COMMENT '航班号，如 CA1831、MU5102',

    airline_code CHAR(2) NOT NULL COMMENT '所属航空公司代码，引用 airlines 表',
    route_id INT NOT NULL COMMENT '航线ID，引用 routes 表（含出发/到达机场）',

    scheduled_departure_time TIME NOT NULL COMMENT '计划起飞时间（如 08:00:00）',
    scheduled_arrival_time TIME NOT NULL COMMENT '计划到达时间（如 10:30:00）',

    aircraft_type VARCHAR(20) COMMENT '机型代码，如 B737、A320、A330',

    # 舱位信息
    economy_seats INT NOT NULL DEFAULT 120,
    business_seats INT NOT NULL DEFAULT 30,
    first_seats INT NOT NULL DEFAULT 10,

    operating_days VARCHAR(7) DEFAULT '1111111',
    status ENUM('active', 'suspended') DEFAULT 'active',

    FOREIGN KEY (airline_code) REFERENCES airlines(airline_code),
    FOREIGN KEY (route_id) REFERENCES routes(route_id),
    INDEX idx_route (route_id)
);

INSERT INTO flights (
    flight_number, airline_code, route_id,
    scheduled_departure_time, scheduled_arrival_time,
    aircraft_type,
    economy_seats, business_seats, first_seats,
    operating_days, status
) VALUES
-- 1. PEK → CTU (国航)
('CA1831', 'CA', (SELECT route_id FROM routes WHERE departure_airport_code='PEK' AND arrival_airport_code='CTU'),
 '08:00:00', '10:30:00', 'B737', 120, 24, 8, '1111111', 'active'),

-- 2. PEK → CTO (国航返程双流)
('CA1835', 'CA', (SELECT route_id FROM routes WHERE departure_airport_code='PEK' AND arrival_airport_code='CTO'),
 '09:20:00', '11:50:00', 'B737', 120, 24, 8, '1111111', 'active'),

-- 3. PKX → CTU (南航大兴出发)
('CZ3901', 'CZ', (SELECT route_id FROM routes WHERE departure_airport_code='PKX' AND arrival_airport_code='CTU'),
 '10:10:00', '12:50:00', 'A320', 125, 22, 6, '1111100', 'active'),

-- 4. PKX → CTO (南航到双流)
('CZ3905', 'CZ', (SELECT route_id FROM routes WHERE departure_airport_code='PKX' AND arrival_airport_code='CTO'),
 '13:30:00', '16:10:00', 'A320', 125, 22, 6, '1111100', 'active'),

-- 5. PVG → CAN (东航)
('MU5302', 'MU', (SELECT route_id FROM routes WHERE departure_airport_code='PVG' AND arrival_airport_code='CAN'),
 '14:20:00', '16:40:00', 'A320', 130, 20, 0, '1111111', 'active'),

-- 6. SHA → CAN (东航虹桥出发)
('MU5312', 'MU', (SELECT route_id FROM routes WHERE departure_airport_code='SHA' AND arrival_airport_code='CAN'),
 '16:00:00', '18:10:00', 'A320', 130, 20, 0, '1111111', 'active'),

-- 7. CTU → CAN (川航成都天府出发)
('3U3456', '3U', (SELECT route_id FROM routes WHERE departure_airport_code='CTU' AND arrival_airport_code='CAN'),
 '08:40:00', '10:50:00', 'A320', 130, 18, 0, '1111111', 'active'),

-- 8. CTO → CAN (川航双流出发)
('3U3466', '3U', (SELECT route_id FROM routes WHERE departure_airport_code='CTO' AND arrival_airport_code='CAN'),
 '11:20:00', '13:30:00', 'A320', 130, 18, 0, '1111111', 'active'),

-- 9. XIY → CTU (西部快线)
('HU7801', 'HU', (SELECT route_id FROM routes WHERE departure_airport_code='XIY' AND arrival_airport_code='CTU'),
 '07:10:00', '08:40:00', 'B737', 115, 24, 8, '1111111', 'active'),

-- 10. XIY → CTO
('HU7805', 'HU', (SELECT route_id FROM routes WHERE departure_airport_code='XIY' AND arrival_airport_code='CTO'),
 '10:00:00', '11:30:00', 'B737', 115, 24, 8, '1111111', 'active'),

-- 11. URC → PEK (国航远程)
('CA1298', 'CA', (SELECT route_id FROM routes WHERE departure_airport_code='URC' AND arrival_airport_code='PEK'),
 '10:00:00', '14:30:00', 'B777', 250, 40, 12, '1111000', 'active'),

-- 12. URC → PKX
('CA1299', 'CA', (SELECT route_id FROM routes WHERE departure_airport_code='URC' AND arrival_airport_code='PKX'),
 '15:20:00', '19:50:00', 'B777', 250, 40, 12, '1111000', 'active'),

-- 13. WUH → PVG (东航武汉线)
('MU2701', 'MU', (SELECT route_id FROM routes WHERE departure_airport_code='WUH' AND arrival_airport_code='PVG'),
 '08:30:00', '10:00:00', 'A320', 130, 20, 0, '1111111', 'active'),

-- 14. WUH → SHA
('MU2711', 'MU', (SELECT route_id FROM routes WHERE departure_airport_code='WUH' AND arrival_airport_code='SHA'),
 '13:10:00', '14:40:00', 'A320', 130, 20, 0, '1111111', 'active'),

-- 15. CKG → NKG (川航)
('3U3267', '3U', (SELECT route_id FROM routes WHERE departure_airport_code='CKG' AND arrival_airport_code='NKG'),
 '13:50:00', '16:10:00', 'A320', 130, 18, 0, '1111100', 'active'),

-- 16. CSX → CAN (川航长沙线)
('3U3888', '3U', (SELECT route_id FROM routes WHERE departure_airport_code='CSX' AND arrival_airport_code='CAN'),
 '07:20:00', '08:30:00', 'A320', 130, 18, 0, '1111111', 'active');


