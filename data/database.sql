CREATE DATABASE Manager;
USE Manager;

CREATE TABLE users (
    id CHAR(9) PRIMARY KEY,                    -- 用户id
    user_name VARCHAR(50) NOT NULL UNIQUE,     -- 用户名
    password VARCHAR(255) NOT NULL,            -- 密码
    address_list JSON,                         -- 地址列表
    CHECK (id REGEXP '^[0-9]{9}$')             -- 限制只能为9位数字
);

CREATE TABLE station_managers (
    id CHAR(6) PRIMARY KEY,                    -- 管理员ID
    user_name VARCHAR(50) NOT NULL UNIQUE,  -- 管理员用户名
    password VARCHAR(255) NOT NULL,            -- 密码
    CHECK (id REGEXP '^[0-9]{6}$')
);

CREATE TABLE stations (
    station_id INT PRIMARY KEY AUTO_INCREMENT,       -- 驿站ID
    manager_id CHAR(6) NOT NULL,                     -- 所属管理员
    station_name VARCHAR(50) NOT NULL,               -- 驿站名称
    address VARCHAR(255) NOT NULL,                   -- 驿站地址
    coordinates POINT,                               -- 经纬度坐标
    speed_score DECIMAL(3,1),                        -- 速度评分 (通过触发器维护)
    service_score DECIMAL(3,1),                      -- 服务评分 (通过触发器维护)
    price_score DECIMAL(3,1),                        -- 价格评分 (通过触发器维护)
    business_hours VARCHAR(50),                      -- 营业时间（如 08:00-22:00）
    business_area VARCHAR(50),                       -- 营业区域
    capacity INT,                                    -- 容量
    is_open BOOLEAN DEFAULT TRUE,                    -- 是否营业

    FOREIGN KEY (manager_id) REFERENCES station_managers(id)
);

CREATE TABLE comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(9) NOT NULL,
    station_id INT NOT NULL,
    speed_score TINYINT CHECK (speed_score >= 1 AND speed_score <= 5),
    service_score TINYINT CHECK (service_score >= 1 AND service_score <= 5),
    price_score TINYINT CHECK (price_score >= 1 AND price_score <= 5),
    comment_content TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (station_id) REFERENCES stations(station_id)
);

CREATE TRIGGER update_station_scores
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
    UPDATE stations
    SET
        speed_score = (SELECT AVG(speed_score) FROM comments WHERE station_id = NEW.station_id),
        service_score = (SELECT AVG(service_score) FROM comments WHERE station_id = NEW.station_id),
        price_score = (SELECT AVG(price_score) FROM comments WHERE station_id = NEW.station_id)
    WHERE station_id = NEW.station_id;
END;

CREATE TRIGGER update_station_scores_on_delete
AFTER DELETE ON comments
FOR EACH ROW
BEGIN
    UPDATE stations
    SET
        speed_score = (SELECT AVG(speed_score) FROM comments WHERE station_id = OLD.station_id),
        service_score = (SELECT AVG(service_score) FROM comments WHERE station_id = OLD.station_id),
        price_score = (SELECT AVG(price_score) FROM comments WHERE station_id = OLD.station_id)
    WHERE station_id = OLD.station_id;
END;

CREATE TABLE favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(9) NOT NULL,
    station_id INT NOT NULL,
    favorite_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (station_id) REFERENCES stations(station_id),
    UNIQUE (user_id, station_id)
);

CREATE TABLE blocks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(9) NOT NULL,
    station_id INT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (station_id) REFERENCES stations(station_id),
    UNIQUE (user_id, station_id)
);

CREATE TABLE waybills (
    tracking_number INT PRIMARY KEY AUTO_INCREMENT,        -- 运单号（4位数字，系统自增）
    send_time DATETIME NOT NULL,                           -- 发出时间（格式 YYYY-MM-DD HH:MM）
    receive_time DATETIME DEFAULT NULL,                    -- 签收时间（可为空）
    origin CHAR(100) NOT NULL,                             -- 出发地
    destination CHAR(100) NOT NULL,                        -- 目的地

    status CHAR(2) NOT NULL CHECK (status IN ('00','01','10','11')), -- 状态编码(00：未发货，01：待取件，10：运输中，11：已签收)

    sender_id CHAR(9) NOT NULL,                            -- 寄件人ID（用户）
    receiver_id CHAR(9) NOT NULL,                          -- 收件人ID（用户）
    current_station_id INT NOT NULL,                       -- 当前驿站ID

    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    FOREIGN KEY (current_station_id) REFERENCES stations(station_id)
);
