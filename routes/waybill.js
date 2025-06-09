const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.post('/not_shipped', (req, res) => {
    const { userId } = req.body;

    const sql = `
        SELECT
            *,
            CONCAT('YD', DATE_FORMAT(send_time, '%Y%m%d'), LPAD(tracking_number, 4, '0')) AS order_number
        FROM waybills
        WHERE status = '00' AND (sender_id = ? OR receiver_id = ?)
    `;

    db.query(sql, [userId, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: '查询失败' });
        }
        if(result.length === 0) {
            return res.status(404).send({ message: '未找到该运单' });
        }
        res.send(result);
    });
});


router.post('/pending_pickup', (req, res) => {
    const { userId } = req.body;

    const sql = `
        SELECT
            *,
            CONCAT('YD', DATE_FORMAT(send_time, '%Y%m%d'), LPAD(tracking_number, 4, '0')) AS order_number
        FROM waybills
        WHERE receiver_id = ? AND status = '01'
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: '查询失败' });
        }
        if(result.length === 0) {
            return res.status(404).send({ message: '未找到该运单' });
        }
        res.send(result);
    });
});

router.post('/in_transit', (req, res) => {
    const { userId } = req.body;

    const sql = `
        SELECT
            *,
            CONCAT('YD', DATE_FORMAT(send_time, '%Y%m%d'), LPAD(tracking_number, 4, '0')) AS order_number
        FROM waybills
        WHERE status = '10' AND (sender_id = ? OR receiver_id = ?)
    `;

    db.query(sql, [userId, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: '查询失败' });
        }
        if(result.length === 0) {
            return res.status(404).send({ message: '未找到该运单' });
        }
        res.send(result);
    });
});

router.post('/history', (req, res) => {
    const { userId } = req.body;

    const sql = `
        SELECT
            *,
            CONCAT('YD', DATE_FORMAT(send_time, '%Y%m%d'), LPAD(tracking_number, 4, '0')) AS order_number
        FROM waybills
        WHERE status = '11' AND (sender_id = ? OR receiver_id = ?)
    `;

    db.query(sql, [userId, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: '查询失败' });
        }
        if(result.length === 0) {
            return res.status(404).send({ message: '未找到该运单' });
        }
        res.send({ history_waybills: result });
    });
});


router.post('/query', (req, res) => {
    const { orderNumber } = req.body;

    // 检查格式：必须是 YD 开头 + 8 位日期 + 4 位数字
    if (!/^YD\d{8}\d{4}$/.test(orderNumber)) {
        return res.status(400).send({ message: '订单号格式应为 YD + 日期(8位) + 编号(4位)' });
    }

    // 提取运单号后4位
    const trackingSuffix = orderNumber.slice(-4); // 取最后 4 位数字

    const sql = `
        SELECT
            *,
            CONCAT('YD', DATE_FORMAT(send_time, '%Y%m%d'), LPAD(tracking_number, 4, '0')) AS order_number
        FROM waybills
        WHERE LPAD(tracking_number, 4, '0') = ?
    `;

    db.query(sql, [trackingSuffix], (err, result) => {
        if (err) {
            console.error('查询错误:', err);
            return res.status(500).send({ message: '查询失败' });
        }
        if (result.length === 0) {
            return res.status(404).send({ message: '未找到匹配的运单' });
        }
        res.send(result[0]);
    });
});



module.exports = router;
