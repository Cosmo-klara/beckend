## 数据库部署

> 从零开始：在你的数据库编辑器(比如 Datagrip )中执行 [sql 文件](./data/database.sql)中的内容即可

> 使用我创建的[测试数据(尚未创建hh)](./data/data.sql)：登录 MySQL，创建一个数据库并使用 ( use )，在终端中使用 `mysql -u root -p db_name < .sql文件路径` 导入数据库即可

### 数据库详细设计

目前的简略的 ER 模型 hh：

```bash
users ───┬───< favorites >───┬─── stations ───< comments
         │                   │
         └───────────────────┘
station_manager ───< stations
```

#### 用户

+ 用户表 users 表

```sql
CREATE TABLE users (
    id CHAR(9) PRIMARY KEY,                    -- 用户id
    user_name VARCHAR(50) NOT NULL UNIQUE,     -- 用户名
    password VARCHAR(255) NOT NULL,            -- 密码
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
    station_name VARCHAR(100) NOT NULL,              -- 驿站名称
    address VARCHAR(255) NOT NULL,                   -- 驿站地址
    score DECIMAL(3,2),                              -- 综合评分 (通过触发器维护)
    business_hours VARCHAR(50),                      -- 营业时间（如 08:00-22:00）
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
    score TINYINT CHECK (score >= 1 AND score <= 5),
    comment_content TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (station_id) REFERENCES stations(station_id)
);
```

+ 评分触发器

```sql
CREATE TRIGGER update_station_score
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
  UPDATE stations
  SET score = (
      SELECT AVG(score)
      FROM comments
      WHERE station_id = NEW.station_id
  )
  WHERE station_id = NEW.station_id;
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





