USE skytrip;

#创建乘客表，不管是否注册了应用只要和订单有关就是乘客
CREATE TABLE passengers (
    passenger_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    id_card CHAR(18) NOT NULL,
    gender ENUM('M', 'F', 'N') COMMENT '性别',
    birthday DATE COMMENT '出生日期',
    nationality VARCHAR(50) DEFAULT '中国',
    contact_phone VARCHAR(20) COMMENT '乘机人联系电话（可选）',

    #唯一性约束：确保同一身份证+姓名视为同一人
    UNIQUE KEY uk_passenger (id_card, name)
);


INSERT INTO passengers (name, id_card, gender, birthday, nationality, contact_phone) VALUES
('李行健', '130104200404250000', 'M', '2004-04-25', '中国', '15032717237'),
('张伟', '110101199001011234', 'M', '1990-01-01', '中国', '13812345678'),
('李娜', '110101198505152345', 'F', '1985-05-15', '中国', '13987654321'),
('王小明', '110101199503124567', 'M', '1995-03-12', '中国', '15011112222'),
('刘小雨', '110101201508201234', 'F', '2015-08-20', '中国', NULL),
('陈国强', '110101198003035678', 'M', '1980-03-03', '中国', '13500001111'),
('张丽', '110101199210108888', 'F', '1992-10-10', '中国', '13812348888')
