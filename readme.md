## 一个简单的nodejs后端服务

### 1. 安装依赖

进入项目目录，执行命令：
```
npm install
```

### 2. 配置数据库

> 在 db.js 中修改数据库连接信息的信息，如用户，密码及连接的数据库，理论上可以改成云端数据库

```javascript
    const pool = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'your_password',
        database: 'your_database_name',
        charset: 'utf8'
    });
```

> 仅用于临时测试（确保安装并配置了MySQL）,如下配置数据库即可

```sql
CREATE DATABASE Manager;
USE Manager;

CREATE TABLE IF NOT EXISTS users
(
    id   INT COMMENT '用户id',
    password VARCHAR(20) COMMENT '用户密码'
);

CREATE TABLE IF NOT EXISTS station_manager
(
    id   INT COMMENT '管理员id',
    password VARCHAR(20) COMMENT '管理员密码'
);

INSERT INTO manager.users (id, password) VALUES (111111111, 'cosmo');
```


### 3. 启动服务

```
node server.js
```

后端数据库服务将会运行在本地3000端口
