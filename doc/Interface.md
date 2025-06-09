# 📦 快递驿站系统接口文档

## 用户 `/auth`

### ✅ 注册
- 接口地址：`http://localhost:3000/auth/register`
- 请求方法：POST
- 请求参数：
  - `role`: `"users"` 或 `"station_managers"`
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

## 收藏 `/favorite`

### ✅ 查看我的收藏
- 接口地址：`http://localhost:3000/favorite/query`
- 请求方法：POST
- 请求参数：
  - `userId`：用户 ID
- 返回参数：收藏的驿站信息数组

### ✅ 添加收藏
- 接口地址：`http://localhost:3000/favorite/add`
- 请求方法：POST
- 请求参数：
  - `userId`：用户 ID
  - `stationId`：驿站 ID

### ✅ 移除收藏
- 接口地址：`http://localhost:3000/favorite/remove`
- 请求方法：POST
- 请求参数：
  - `userId`：用户 ID
  - `stationId`：驿站 ID

## 驿站管理员 `/manager`

### ✅ 查询管理的驿站
- 接口地址：`http://localhost:3000/manager/query`
- 请求方法：POST
- 请求参数：
  - `managerId`：管理员 ID

### ✅ 添加驿站
- 接口地址：`http://localhost:3000/manager/add`
- 请求方法：POST
- 请求参数：
  - `managerId`：管理员 ID
  - `station_name`、`address`、`business_hours`、`business_area`
  - `capacity`：容量
  - `is_open`：是否营业（1/0）

### ✅ 修改驿站信息
- 接口地址：`http://localhost:3000/manager/modify`
- 请求方法：POST
- 请求参数：
  - `stationId`：驿站 ID
  - 其他字段同添加

### ✅ 删除驿站
- 接口地址：`http://localhost:3000/manager/remove`
- 请求方法：POST
- 请求参数：
  - `stationId`：驿站 ID

## 驿站信息 `/station`

### ✅ 查询所有驿站
- 接口地址：`http://localhost:3000/station/query`
- 请求方法：POST

### ✅ 名字模糊查询
- 接口地址：`http://localhost:3000/station/query_by_name`
- 请求方法：POST
- 请求参数：
  - `keyword`：名称关键词

## 用户信息 `/user`

### ✅ 重命名
- 接口地址：`http://localhost:3000/user/rename`
- 请求参数：
  - `userId`，`newName`

### ✅ 重设密码
- 接口地址：`http://localhost:3000/user/reset_password`
- 请求参数：
  - `userId`，`newPassword`

### ✅ 地址查询
- 接口地址：`http://localhost:3000/user/query_address`
- 请求参数：
  - `userId`

### ✅ 添加地址
- 接口地址：`http://localhost:3000/user/add_address`
- 请求参数：
  - `userId`，`address`（对象：包含 recipient、phone、address_detail 等字段）

### ✅ 删除地址
- 接口地址：`http://localhost:3000/user/delete_address`
- 请求参数：
  - `userId`，`index`（要删除的 JSON 数组下标）

## 运单 `/waybill`

### ✅ 查询未发货
- 接口地址：`http://localhost:3000/waybill/not_shipped`
- 参数：
  - `userId`（寄件人）

### ✅ 查询待取件
- 接口地址：`http://localhost:3000/waybill/pending_pickup`
- 参数：
  - `userId`（收件人）

### ✅ 查询运输中
- 接口地址：`http://localhost:3000/waybill/in_transit`
- 参数：
  - `userId`（寄件人或收件人）

### ✅ 查询历史运单
- 接口地址：`http://localhost:3000/waybill/history`
- 参数：
  - `userId`（寄件人或收件人）

### ✅ 查询单个运单
- 接口地址：`http://localhost:3000/waybill/query`
- 参数：
  - `orderNumber`（格式：`YD202506070012`）
