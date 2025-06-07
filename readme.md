## 一个简单的nodejs后端服务

### 1. 安装依赖

进入项目目录，执行命令：

```bash
npm install
```

### 2. 配置数据库

**本地数据库部署（用于开发）：参见 [database.md](./data/database.md)**

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

### 3. 启动服务

在项目目录下输入下面的命令，后端数据库服务将会运行在本地3000端口

```bash
node server.js
```

### 4. [接口文档](./routes/README.md)
