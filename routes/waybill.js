const express = require('express');
const router = express.Router();
const db = require('../db.js');

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





module.exports = router;
