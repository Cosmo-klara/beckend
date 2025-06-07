## 接口说明

> 需要增加接口功能可以直接联系我

### 使用范例：

> vue有一个uni的请求库应该是，我没用，前端对接的可以用AI或者自己研究一下，应该是可以用 `vite.config.js` 来做代理配置这样接口就能省略掉前面的网址了

+ 后端

    ```js
    router.post('/login', (req, res) => {
        const { id, password } = req.body; // 前端发送请求的响应

        let tableName;
        // 结合数据库设计判断用户角色，这里是根据用户id的长度来判断
        // 设计上前端也需要验证才行（如果不是6/9需要提示非法用户id）
        if (id.length === 9) {
            tableName = 'users';
        } else if (id.length === 6) {
            tableName = 'station_managers';
        } else {
            return res.status(400).send('Invalid ID');
        }

        const sql = `SELECT * FROM ${tableName} WHERE id = ?`;

        db.query(sql, [id], (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                return res.status(400).send('User not found');
            }
            const user = result[0]; // 数据库查询的返回值
            if (user.password !== password)
                return res.status(400).send('Incorrect password');
            // 回传的信息，如果要更加规范可以用一个（result，flag）作为返回的数据，不过需要前端自己来进一步解析数据
            res.send({ message: 'Login successful', user, role: tableName });
        });
    });
    ```

+ 前端

    ```js
        // 登录接口
    fetch('http://127.0.0.1:3000/auth/login', { // auth 是后端路由，/login 相当于后端路由下的子路由
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: form.value.id, password: form.value.password }) // 传递用户名和密码(请求参数)
    })
        .then(response => response.json()) // 解析响应为JSON格式
        .then(data => {
        if (data.message === 'Login successful') { // 这里就是用后端返回的数据来判断登录是否成功
            loginMessage.value = '登录成功';
            loginMessageColor.value = 'green';

            // 获取登录者角色 （user or station_manager）
            const role = data.role;
            let redirectUrl;
            if (role === 'users') {
            redirectUrl = '/pages/index/index';
            } else if (role === 'station_managers') {
            redirectUrl = '/pages/index/index';
            }
            setTimeout(() => {
            uni.redirectTo({ url: redirectUrl });
            }, 1000); // 1秒后跳转

        } else {
            loginMessage.value = data.message || '登录失败，请重试';
            loginMessageColor.value = 'red';
        }
        })
        .catch(error => {
        loginMessage.value = '请求出错，请稍后重试';
        loginMessageColor.value = 'red';
        console.error('Error:', error);
        });
    ```

+ 接口测试

    ```bash
    curl -X POST -H "Content-Type: application/json" -d "{\"id\": \"100000000\", \"password\": \"0\"}" http://localhost:3000/auth/login
    ```

    得到的结果为 {"message":"Login successful","user":{"id":"100000000","user_name":"user_0","password":"0"},"role":"users"}

### 接口数据详细说明

#### 用户

> 路由 `/auth`

+ 登录
    + 接口地址：` http://localhost:3000/auth/login`
    + 请求方法：POST
    + 请求参数：
        + `id`：用户ID，长度为6或9
        + `password`：用户密码
    + 返回参数：
        + `message`：登录结果信息，成功为"Login successful"，失败为具体错误信息
        + `user`：用户信息，包含`id`和`password`
        + `role`：用户角色，"users"或"station_managers"

+ 注册
    + 接口地址：`http://localhost:3000/auth/register`
    + 请求方法：POST
    + 请求参数：
        + `role` ：用户角色，"user"或"station_manager"
        + `id`：用户ID，长度为6或9
        + `password`：用户密码
    + 返回参数：
        + `message`：注册结果信息，成功为"Register successful"，失败为具体错误信息


#### 收藏

> 路由 `/favorite`

+ 查询
    + 接口地址：`http://localhost:3000/favorite/query`
    + 请求方法：GET
    + 请求参数：
        + `user_id`：用户ID，长度为9
    + 返回参数：
        + `favorite_list`：用户收藏的驿站列表，包含`station_id`、`station_name`、`ddress`、`score`、`business_hours`、`capacity`、`is_open`

    ```bash
    curl -X POST -H "Content-Type: application/json" -d "{\"user_id\": \"100000001\"}" http://localhost:3000/favorite/query
    ```

    + 返回结果：(后续json不再展开)

        ```json
        {
            "favorite_list": [
                {
                    "station_id": 1,
                    "station_name": "南山驿站",
                    "address": "深圳市南山区科技园",
                    "score": "4.67",
                    "business_hours": "08:00-20:00",
                    "capacity": 100,
                    "is_open": 1
                },
                {
                    "station_id": 2,
                    "station_name": "西湖驿站",
                    "address": "杭州市西湖区龙井路",
                    "score": "3.67",
                    "business_hours": "06:00-17:00",
                    "capacity": 90,
                    "is_open": 0
                },
                {
                    "station_id": 3,
                    "station_name": "中关村驿站",
                    "address": "北京市中关村南大街",
                    "score": "3.60",
                    "business_hours": "09:00-22:00",
                    "capacity": 100,
                    "is_open": 1
                },
                {
                    "station_id": 4,
                    "station_name": "浦东驿站",
                    "address": "上海市浦东新区张江路",
                    "score": "4.00",
                    "business_hours": "08:00-20:00",
                    "capacity": 150,
                    "is_open": 1
                },
                {
                    "station_id": 5,
                    "station_name": "鼓楼驿站",
                    "address": "南京市鼓楼区中山北路",
                    "score": "4.27",
                    "business_hours": "10:00-22:00",
                    "capacity": 200,
                    "is_open": 1
                }
            ]
        }
        ```

+ 添加
    + 接口地址：`http://localhost:3000/favorite/add`
    + 请求方法：POST
    + 请求参数：
        + `user_id`：用户ID，长度为9
        + `station_id`：驿站ID
    + 返回参数：
        + `message`：成功为 "Favorite added successfully"

+ 移除
    + 接口地址：`http://localhost:3000/favorite/remove`
    + 请求方法：POST
    + 请求参数：
        + `user_id`：用户ID，长度为9
        + `station_id`：驿站ID
    + 返回参数：
        + `message`：成功为 "Favorite removed successfully"




#### 驿站





















