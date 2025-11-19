USE skytrip;
# 创建航空公司表


# airline_code 两字符主键 航空公司二字代码，如 CA、MU、CZ 国际航空运输协会（IATA）代码
# airline_name 航空公司全称
# country 所属国家，默认中国

CREATE TABLE airlines (
    airline_code CHAR(2) PRIMARY KEY,
    airline_name VARCHAR(100) NOT NULL,
    country VARCHAR(50) DEFAULT '中国'
);

INSERT INTO airlines (airline_code, airline_name) VALUES
('CA', '中国国际航空'),
('MU', '中国东方航空'),
('CZ', '中国南方航空'),
('HU', '海南航空'),
('3U', '四川航空');

ALTER TABLE airlines CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;