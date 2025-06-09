## 数据库部署

### 从零开始

> 推荐使用，便于更改

在你的数据库编辑器(比如 Datagrip )中执行 [database.sql 文件](./data/database.sql)中的内容创建数据库, 并使用 [test.sql 文件](./data/test.sql)中的内容插入数据

### 直接导入数据库

> 导出可能影响创建顺序之类的，格式也不好，不便于开发，不建议

使用我创建( mysqldump 导出的)的 [data.sql](./data/data.sql)：登录 MySQL，创建一个数据库并使用 ( use )，在终端中使用 `mysql -u root -p db_name < .sql文件路径` 导入数据库即可

### 数据库详细设计

目前的简略的 ER 模型 hh：

```bash
station_manager ───< stations ───┬───< comments —— update_station_score
                                 │
users ───┬───< favorites >───────┘
         │
         └───< waybills
```

#### 用户

+ 用户表 users 表

```sql
CREATE TABLE users (
    id CHAR(9) PRIMARY KEY,                    -- 用户id
    user_name VARCHAR(50) NOT NULL UNIQUE,     -- 用户名
    password VARCHAR(255) NOT NULL,            -- 密码
    address_list JSON,                         -- 地址列表
    CHECK (id REGEXP '^[0-9]{9}$')             -- 限制只能为9位数字
);
```

+ 管理员 station_manager 表

```sql
CREATE TABLE station_manager (
    id CHAR(6) PRIMARY KEY,                    -- 管理员ID
    manager_name VARCHAR(50) NOT NULL UNIQUE,  -- 管理员用户名
    password VARCHAR(255) NOT NULL,            -- 密码
    CHECK (id REGEXP '^[0-9]{6}$')
);
```

#### 驿站

+ 驿站表

```sql
CREATE TABLE stations (
    station_id INT PRIMARY KEY AUTO_INCREMENT,       -- 驿站ID
    manager_id CHAR(6) NOT NULL,                     -- 所属管理员
    station_name VARCHAR(50) NOT NULL,              -- 驿站名称
    address VARCHAR(255) NOT NULL,                   -- 驿站地址
    coordinates POINT,                               -- 经纬度坐标
    speed_score DECIMAL(3,1),                        -- 速度评分 (通过触发器维护)
    service_score DECIMAL(3,1),                      -- 服务评分 (通过触发器维护)
    price_score DECIMAL(3,1),                        -- 价格评分 (通过触发器维护)
    business_hours VARCHAR(50),                      -- 营业时间（如 08:00-22:00）
    business_area VARCHAR(50),                       -- 营业区域
    capacity INT,                                    -- 容量
    is_open BOOLEAN DEFAULT TRUE,                    -- 是否营业

    FOREIGN KEY (manager_id) REFERENCES station_manager(id)
);
```

+ 评价表

```sql
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
```

+ 评分触发器(速度、服务、价格)

```sql
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
```

#### 收藏

+ 收藏表

```sql
CREATE TABLE favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(9) NOT NULL,
    station_id INT NOT NULL,
    favorite_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (station_id) REFERENCES stations(station_id),
    UNIQUE (user_id, station_id)  -- 防止重复收藏
);
```

#### 运单 Waybill

+ 运单表

```sql
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
```
