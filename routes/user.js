const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.post('/query_address', (req, res) => {
    const { id } = req.body;

    const sql = `SELECT JSON_PRETTY(address) FROM users WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(400).send({ message: '地址为空' });
        }
        res.send({ address: result[0] });
    });
});

// 一次添加一条
router.post('/add_address', (req, res) => {
    const { id, address } = req.body;

    const sql = `
        UPDATE users
        SET address = JSON_ARRAY_APPEND(
            IFNULL(address, JSON_ARRAY()), '$',
            CAST(? AS JSON)
        )
        WHERE id = ?
    `;

    const jsonAddress = JSON.stringify(address);  // 确保 address 是 JSON 字符串

    db.query(sql, [jsonAddress, id], (err, result) => {
        if (err) {
            console.error('Error adding address:', err);
            return res.status(500).send({ message: '添加地址失败' });
        }
        if (result.affectedRows === 0)
            return res.status(404).send({ message: '用户不存在或更新失败' });
        res.send({ message: '添加地址成功' });
    });
});

router.post('/delete_address', (req, res) => {
    const { id, index } = req.body;

    const sql = `
        UPDATE users
        SET address = JSON_REMOVE(address, CONCAT('$[', ?, ']'))
        WHERE id = ?
        AND JSON_LENGTH(address) > ?
    `;

    db.query(sql, [index, id, index], (err, result) => {
        if (err) {
            console.error('Error deleting address:', err);
            return res.status(500).send({ message: '删除地址失败' });
        }
        if (result.affectedRows === 0)
            return res.status(404).send({ message: '用户不存在或索引越界' });
        res.send({ message: '地址删除成功' });
    });
});

module.exports = router;


















module.exports = router;