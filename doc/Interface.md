# 📦 快递驿站系统接口文档

## 用户 `/auth`

### ✅ 注册
- 接口地址：`http://localhost:3000/auth/register`
- 请求方法：POST
- 请求参数：
  - `role`: `"user"` 或 `"station_manager"`
  - `id`：用户 ID，6 位（管理员）或 9 位（普通用户）
  - `password`：密码
-  返回参数：
  - `message`：注册状态消息
  - `userId`

### ✅ 登录
- 接口地址：`http://localhost:3000/auth/login`
- 请求方法：POST
- 请求参数：
  - `id`：用户 ID，6 位（管理员）或 9 位（普通用户）
  - `password`：密码
- 返回参数：
  - `message`：登录状态消息
  - `user`：用户信息对象（含 `id` 和 `password`等）
  - `role`：用户角色，如 `"users"` 或 `"station_managers"`

## 评论 `/comment`

### ✅ 查看驿站评价
- 接口地址：`http://localhost:3000/comment/query`
- 请求方法：POST
- 请求参数：
  - `stationId`：驿站 ID
- 返回参数：评价列表

### ✅ 查看我的评价
- 接口地址：`http://localhost:3000/comment/query_mine`
- 请求方法：POST
- 请求参数：
  - `userId`：用户 ID
- 返回参数：该用户所有评价列表

### ✅ 添加评价
- 接口地址：`http://localhost:3000/comment/add`
- 请求方法：POST
- 请求参数：
  - `userId`：用户 ID
  - `stationId`：驿站 ID
  - `speed_score`：速度评分（1~5）
  - `service_score`：服务评分（1~5）
  - `price_score`：价格评分（1~5）
  - `comment_content`：评论内容
- 返回参数：
  - `message`：操作结果
  - `commentId`：新评价 ID

### ✅ 删除评价
- 接口地址：`http://localhost:3000/comment/delete`
- 请求方法：POST
- 请求参数：
  - `commentId`：评论 ID
  - `userId`：用户 ID（防止越权）
- 返回参数：
  - `message`：删除结果消息

## 收藏 `/block`

### ✅ 查看我的屏蔽
- 接口地址：`http://localhost:3000/block/query`
- 请求方法：POST
- 请求参数：
  - `userId`：用户 ID
- 返回参数：屏蔽的驿站信息列表

### ✅ 添加屏蔽
- 接口地址：`http://localhost:3000/block/add`
- 请求方法：POST
- 请求参数：
  - `userId`：用户 ID
  - `stationId`：驿站 ID
- 返回参数：
  - `message`：添加屏蔽结果

### ✅ 移除屏蔽
- 接口地址：`http://localhost:3000/block/remove`
- 请求方法：POST
- 请求参数：
  - `userId`：用户 ID
  - `stationId`：驿站 ID
- 返回参数：
  - `message`：移除结果

## 收藏 `/favorite`

### ✅ 查看我的收藏
- 接口地址：`http://localhost:3000/favorite/query`
- 请求方法：POST
- 请求参数：
  - `userId`：用户 ID
- 返回参数：收藏的驿站信息列表

### ✅ 添加收藏
- 接口地址：`http://localhost:3000/favorite/add`
- 请求方法：POST
- 请求参数：
  - `userId`：用户 ID
  - `stationId`：驿站 ID
- 返回参数：
  - `message`：添加结果

### ✅ 移除收藏
- 接口地址：`http://localhost:3000/favorite/remove`
- 请求方法：POST
- 请求参数：
  - `userId`：用户 ID
  - `stationId`：驿站 ID
- 返回参数：
  - `message`：移除结果

## 驿站管理员 `/manager`

### ✅ 查询管理的驿站
- 接口地址：`http://localhost:3000/manager/query`
- 请求方法：POST
- 请求参数：
  - `managerId`：管理员 ID
- 返回参数：管理的驿站信息列表

### ✅ 添加驿站
- 接口地址：`http://localhost:3000/manager/add`
- 请求方法：POST
- 请求参数：
  - `managerId`：管理员 ID
  - `station_name`、`address`、`business_hours`、`business_area`
  - `capacity`：容量
  - `is_open`：是否营业（1/0）
- 返回参数：
  - `message`：添加结果消息

### ✅ 修改驿站信息
- 接口地址：`http://localhost:3000/manager/modify`
- 请求方法：POST
- 请求参数：
  - `stationId`：驿站 ID
  - 其他字段同添加(无需 `managerId`)
- 返回参数：
  - `message`：修改结果消息

### ✅ 删除驿站
- 接口地址：`http://localhost:3000/manager/remove`
- 请求方法：POST
- 请求参数：
  - `stationId`：驿站 ID
- 返回参数：
  - `message`：删除结果消息

## 驿站信息 `/station`

### ✅ 查询所有驿站
- 接口地址：`http://localhost:3000/station/query`
- 请求方法：POST
- 请求参数：
  - longitude：用户位置经度
  - latitude： 用户位置纬度
  - userId: 用户 ID, 用于处理屏蔽驿站
- 返回参数：
  - `stations`：{ 驿站信息列表 + distance(米) } (距离升序，限制五条)

### ✅ 名字模糊查询
- 接口地址：`http://localhost:3000/station/query_by_name`
- 请求方法：POST
- 请求参数：
  - `name`：搜索框内容
  - longitude：用户位置经度
  - latitude： 用户位置纬度
  - userId: 用户 ID
- 返回参数：
  - `stations`：{ 驿站信息列表 + distance(米) } (距离升序，限制五条)

## 用户信息 `/user`

### ✅ 重命名
- 接口地址：`http://localhost:3000/user/rename`
- 请求参数：
  - `userId`: 用户 ID
  - `user_name`: 新用户名
- 返回参数：
  - `message`：修改结果消息

### ✅ 重设密码
- 接口地址：`http://localhost:3000/user/reset_password`
- 请求参数：
  - `userId`: 用户 ID
  - `new_password`: 新密码
- 返回参数：
  - `message`：修改结果消息

### ✅ 用户保存地址查询
- 接口地址：`http://localhost:3000/user/query_address`
- 请求参数：
  - `userId`
- 返回参数：
  - `addresses`：用户保存的地址列表(address_list)

### ✅ 添加地址
- 接口地址：`http://localhost:3000/user/add_address`
- 请求参数：
  - `userId`: 用户 ID
  + `address`: 新地址
- 返回参数：
  - `message`：添加结果消息

### ✅ 删除地址
- 接口地址：`http://localhost:3000/user/delete_address`
- 请求参数：
  - `userId` : 用户 ID
  - `index`: 要删除的 JSON 数组下标
- 返回参数：
  - `message`：删除结果消息

## 运单 `/waybill`

### ✅ 查询未发货
- 接口地址：`http://localhost:3000/waybill/not_shipped`
- 请求参数：
  - `userId`: 用户 ID （寄件人或收件人）
- 返回参数：
  - `waybills`：未发货的运单列表

### ✅ 查询待取件
- 接口地址：`http://localhost:3000/waybill/pending_pickup`
- 请求参数：
  - `userId`（收件人）
- 返回参数：
  - `waybills`：待取件的运单列表

### ✅ 查询运输中
- 接口地址：`http://localhost:3000/waybill/in_transit`
- 请求参数：
  - `userId`: 用户 ID （寄件人或收件人）
- 返回参数：
  - `waybills`：运输中的运单列表

### ✅ 查询历史运单
- 接口地址：`http://localhost:3000/waybill/history`
- 请求参数：
  - `userId`: 用户 ID （寄件人或收件人）
- 返回参数：
  - `waybills`：历史运单列表

### ✅ 查询单个运单
- 接口地址：`http://localhost:3000/waybill/query`
- 请求参数：
  - `orderNumber`（格式：`YD202506070012`）
- 返回参数：
  - `waybills`：运单信息
