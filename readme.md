## 一个简单的nodejs后端服务

**项目结构**

📦beckend
 ┣ 📂.git
 ┣ 📂data
 ┃ ┣ 📜database.sql
 ┃ ┣ 📜README.md
 ┃ ┗ 📜test.sql
 ┣ 📂doc
 ┃ ┣ 📜Database.md
 ┃ ┣ 📜Interface_test.ipynb
 ┃ ┗ 📜Interface.md
 ┣ 📂node_modules
 ┣ 📂routes
 ┃ ┣ 📜auth.js
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