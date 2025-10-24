USE skytrip;

#创建用户表，对于个人用户和旅行社人员采用同一个表
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '账户昵称',

    #联系方式
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    #密码，暂时明文
    password VARCHAR(100) NOT NULL COMMENT '密码',

    #基础身份信息（所有用户必填）
    real_name VARCHAR(50) NOT NULL COMMENT '真实姓名',
    id_card CHAR(18) NOT NULL COMMENT '身份证号（用于实名认证与订单关联）',
    #个人资料（增强用户体验）图片这里可以不使用
    avatar_url VARCHAR(255) COMMENT '头像图片URL',
    bio VARCHAR(200) COMMENT '个人签名/简介',
    #会员体系
    vip_level TINYINT UNSIGNED DEFAULT 0 COMMENT 'VIP等级：0-普通用户，1-银卡，2-金卡，3-白金等',
    vip_expire_date DATE NULL COMMENT 'VIP有效期（可选）',
    #角色与组织归属
    role ENUM('individual', 'agency') NOT NULL DEFAULT 'individual',
    agency_id BIGINT NULL COMMENT '所属旅行社ID（仅旅行社员工非空）',

    #约束
    UNIQUE KEY uk_idcard (id_card),          -- 身份证全局唯一（自然人唯一）
    UNIQUE KEY uk_email (email),             -- 邮箱唯一（若允许邮箱登录）
    UNIQUE KEY uk_phone (phone),             -- 手机号唯一（若允许手机登录）
    FOREIGN KEY (agency_id) REFERENCES agencies(agency_id) ON DELETE SET NULL
);

ALTER TABLE users
MODIFY COLUMN role ENUM('individual', 'agency', 'admin') NOT NULL DEFAULT 'individual';



-- 个人用户（普通旅客）
INSERT INTO users (username, password, real_name, id_card, phone, email, avatar_url, bio, vip_level, role) VALUES
('李济安', '123456', '李行健', '130104200404250000', '15032717237', '15032717237@163.com', '/avatars/li.jpg', '喜欢出行', 2, 'individual'),
('traveler_zhang', '123456', '张伟', '110101199001011234', '13812345678', 'zhangwei@example.com', '/avatars/zhang.jpg', '喜欢探索小众目的地', 0, 'individual'),
('vip_li', 'password', '李娜', '110101198505152345', '13987654321', 'lina@email.com', '/avatars/li.jpg', '飞行常客，年出行10+次', 2, 'individual'),
('user_wang', '111111', '王芳', '110101199212123456', NULL, 'wangfang@test.com', NULL, NULL, 0, 'individual'),
('anonymous_user', 'guest123', '刘强', '110101198811114567', '15011112222', NULL, NULL, '随便看看', 0, 'individual');


INSERT INTO users (username, password, real_name, id_card, phone, email, avatar_url, bio, role, agency_id) VALUES
('陈经理', '123456', '陈国强', '110101198003035678', '13500001111', 'chen@cits.com', '/avatars/chen.jpg', '国旅华北区负责人', 'agency', 1),
('ctrip_staff1', 'ctrip456', '赵小敏', '310115199208083224', '13600002222', 'xiaomin@ctrip.com', '/avatars/zhao.jpg', '携程机票业务专员', 'agency', 3),
('kanghui_sichuan', 'kh789', '周涛', '510101198707076789', '13700003333', 'zhoutao@kanghui.com', NULL, '康辉四川分公司', 'agency', 5);