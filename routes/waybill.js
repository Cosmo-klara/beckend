const express = require('express');
const router = express.Router();
const db = require('../db.js');

// > 需要提供的服务：—— 订单号: 拼接 YD + 运单号查询到的发出时间 + 运单号，比如 YD202510210001;


// + 历史运单：根据用户id查订单信息（两次查询，分发快递和收快递），状态为已签收
// + 未发货：根据用户id作为寄件人查订单信息，状态为未发货
// + 待取件：根据用户id作为收件人查订单信息，状态为待取件
// + 运输中：和历史运单一样，状态为运输中
// + 根据订单号(用后四位作为运单号)来查询运单




router.post('/history', (req, res) => {
    const { id } = req.body;

    const sql = `
        SELECT
            *,
            CONCAT('YD', DATE_FORMAT(send_time, '%Y%m%d'), LPAD(tracking_number, 4, '0')) AS order_number
        FROM waybills
        WHERE status = '11' AND (sender_id = ? OR receiver_id = ?)
    `;

    db.query(sql, [id, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: '查询失败' });
        }
        res.send({ history_waybills: result });
    });
});


router.post('/not_shipped', (req, res) => {
    const { id } = req.body;

    const sql = `
        SELECT
            *,
            CONCAT('YD', DATE_FORMAT(send_time, '%Y%m%d'), LPAD(tracking_number, 4, '0')) AS order_number
        FROM waybills
        WHERE status = '00' AND (sender_id = ? OR receiver_id = ?)
    `;

    db.query(sql, [id, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: '查询失败' });
        }
        res.send(result);
    });
});


router.post('/pending_pickup', (req, res) => {
    const { id } = req.body;

    const sql = `
        SELECT
            *,
            CONCAT('YD', DATE_FORMAT(send_time, '%Y%m%d'), LPAD(tracking_number, 4, '0')) AS order_number
        FROM waybills
        WHERE receiver_id = ? AND status = '01'
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: '查询失败' });
        }
        res.send(result);
    });
});

router.post('/in_transit', (req, res) => {
    const { id } = req.body;

    const sql = `
        SELECT
            *,
            CONCAT('YD', DATE_FORMAT(send_time, '%Y%m%d'), LPAD(tracking_number, 4, '0')) AS order_number
        FROM waybills
        WHERE status = '10' AND (sender_id = ? OR receiver_id = ?)
    `;

    db.query(sql, [id, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: '查询失败' });
        }
        res.send(result);
    });
});



module.exports = router;
