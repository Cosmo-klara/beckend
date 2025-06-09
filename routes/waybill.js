const express = require('express');
const router = express.Router();
const db = require('../db.js');

// > 需要提供的服务：——[返回：订单号: 拼接 YD + 运单号查询到的发出时间 + 运单号，比如 YD202510210001; 其他的信息]

// + 历史运单：根据用户id查订单信息（两次查询，分发快递和收快递），状态为已签收
// + 未发货：根据用户id作为寄件人查订单信息，状态为未发货
// + 待取件：根据用户id作为收件人查订单信息，状态为待取件
// + 运输中：历史运单一样，但是状态为运输中

router.post('/history', (req, res) => {

});

router.post('/not_shipped', (req, res) => {

});

router.post('/pending_pickup', (req, res) => {

});

router.post('/in_transit', (req, res) => {

})

module.exports = router;
