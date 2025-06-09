## 数据库部署

在你的数据库编辑器(比如 Datagrip )中执行 [database.sql 文件](./data/database.sql)中的内容创建数据库, 并使用 [test.sql 文件](./data/test.sql)中的内容插入数据

随后在 [db.js](../db.js) 文件中修改数据库连接信息的信息，如用户，密码及连接的数据库

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

### 数据库设计

数据库设计文档: [Database.md](../doc/Database.md)
