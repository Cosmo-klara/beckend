## 一个简单的nodejs后端服务

**项目结构**

```
📦beckend
 ┣ 📂.git
 ┣ 📂data
 ┃ ┣ 📜database.sql
 ┃ ┣ 📜README.md
 ┃ ┗ 📜test.sql
 ┣ 📂doc
 ┃ ┣ 📂img
 ┃ ┣ 📜Database.md
 ┃ ┣ 📜Interface_test.ipynb
 ┃ ┗ 📜Interface.md
 ┣ 📂node_modules
 ┣ 📂routes
 ┃ ┣ 📜auth.js
 ┃ ┣ 📜block.js
 ┃ ┣ 📜comment.js
 ┃ ┣ 📜favorite.js
 ┃ ┣ 📜manager.js
 ┃ ┣ 📜README.md
 ┃ ┣ 📜station.js
 ┃ ┣ 📜user.js
 ┃ ┣ 📜waybill.js
 ┃ ┗ 📜接口文档.md
 ┣ 📜.gitignore
 ┣ 📜db.js
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜README.md
 ┗ 📜server.js
```

### 架构说明

后端数据库采用 `MySQL` (若需部署到云端可简单采用 ngrok 把服务端口暴露给公网访问)，后端服务器采用 `Node.js` 开发，基于 `Express` 框架搭建。

+ `data`
    + `sql` 文件: 一个是数据库的初始化文件 `database.sql` ，一个是插入测试用数据的文件 `test.sql`。
    + `README.md` 文件: 关于数据库本地部署配置的说明，并提供指向数据库设计文档的链接。
+ `doc`
    + `md` 文件: 一个是数据库设计文档 `Database.md` ，一个是接口文档 `Interface.md`
    + `Interface_test.ipynb` 文件: 提供简单的脚本用于测试各个接口并查看详细数据
    + `Interface_test.html` 文件: 提供接口测试文档的网页版, 也是后端服务默认的主页。
    + `img` 文件夹: 存放数据库模型图。
+ `routes`
    + `js` 文件: 各个路由上接口的实现, 不做详细说明，具体请参阅接口文档及测试脚本。
    + `README.md` 文件: 提供指向接口文档和接口测试文档的链接，以及原生前后端对接的示例(只做示范检验，使用vue的uni就行最终对接)。
+ `db.js`: 数据库连接配置文件。
+ `package.json`: 项目依赖配置文件。
+ `package-lock.json`: 项目依赖锁定文件。
+ `README.md`: 项目说明文件。
+ `server.js`: 后端服务器配置文件。

### 1. 安装依赖

进入项目目录，执行命令：

```bash
npm install
```

### 2. 配置数据库

**本地数据库部署（用于开发）：参见 [data/README.md](data/README.md)**

### 3. 启动服务

在项目目录下输入下面的命令，后端数据库服务将会运行在本地3000端口

```bash
node server.js
```

### 4. [接口文档](doc/Interface.md)

详细的接口返回数据，运行 doc 文件下 [Interface_test.ipynb](doc/Interface_test.ipynb) 即可获取