USE skytrip;

# 创建机场表
CREATE TABLE airports (
    airport_code CHAR(3) PRIMARY KEY COMMENT 'IATA 机场三字码，如 PEK、CTU',
    airport_name VARCHAR(100) NOT NULL COMMENT '机场中文全称',
    city VARCHAR(50) NOT NULL COMMENT '所属城市（中文）',
    country VARCHAR(50) DEFAULT '中国' COMMENT '国家'
);

INSERT INTO airports (airport_code, airport_name, city) VALUES
('PEK', '北京首都国际机场', '北京'),
('PKX', '北京大兴国际机场', '北京'),
('PVG', '上海浦东国际机场', '上海'),
('SHA', '上海虹桥国际机场', '上海'),
('CTU', '成都天府国际机场', '成都'),
('CTO', '成都双流国际机场', '成都'),
('CAN', '广州白云国际机场', '广州'),
('SZX', '深圳宝安国际机场', '深圳'),
('XIY', '西安咸阳国际机场', '西安'),
('CKG', '重庆江北国际机场', '重庆'),
('KMG', '昆明长水国际机场', '昆明'),
('HGH', '杭州萧山国际机场', '杭州'),
('NKG', '南京禄口国际机场', '南京'),
('TSN', '天津滨海国际机场', '天津'),
('URC', '乌鲁木齐地窝堡国际机场', '乌鲁木齐'),
('LHW', '兰州中川国际机场', '兰州'),
('WUH', '武汉天河国际机场', '武汉'),
('CSX', '长沙黄花国际机场', '长沙');