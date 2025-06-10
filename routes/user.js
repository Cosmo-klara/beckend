const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.post('/rename', (req, res) => {
    const { userId, user_name } = req.body;
    if (!userId || !user_name)
        return res.status(400).send({ message: '缺少 userId 或 user_name 参数' });
    const sql = `UPDATE users SET user_name =? WHERE id =?`;

    db.query(sql, [user_name, userId], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: '用户不存在或更新失败' });
        }
        res.send({ message: '用户名更新成功' });
    })
})

router.post('/reset_password', (req, res) => {
    const { userId, new_password } = req.body;
    if (!userId || !new_password)
        return res.status(400).send({ message: '缺少 userId 或 new_password 参数' });

    const checkSql = `SELECT * FROM users WHERE id = ?`;
    db.query(checkSql, [userId], (err, result) => {
        if (err) return res.status(500).send({ message: '数据库错误' });
        if (result.length === 0)
            return res.status(404).send({ message: '用户不存在' });

        const updateSql = `UPDATE users SET password = ? WHERE id = ?`;
        db.query(updateSql, [new_password, userId], (err, result) => {
            if (err) return res.status(500).send({ message: '密码更新失败' });
            res.send({ message: '密码重置成功' });
        });
    });
});

router.post('/query_address', (req, res) => {
    const { userId } = req.body;
    if (!userId)
        return res.status(400).send({ message: '缺少 userId 参数' });

    const sql = `SELECT address_list FROM users WHERE id = ?`;

    db.query(sql, [userId], (err, result) => {
        if (err) throw err;
        if (result.length === 0)
            return res.status(400).send({ message: '地址为空' });
        res.send({ address: result });
    });
});

// 一次添加一条
router.post('/add_address', (req, res) => {
    const { userId, address } = req.body;
    if (!userId || !address)
        return res.status(400).send({ message: '缺少 userId 或 address 参数' });
    const sql = `
        UPDATE users
        SET address_list = JSON_ARRAY_APPEND(
            IFNULL(address_list, JSON_ARRAY()), '$',
            CAST(? AS JSON)
        )
        WHERE id = ?
    `;

    const jsonAddress = JSON.stringify(address);  // 确保 address 是 JSON 字符串

    db.query(sql, [jsonAddress, userId], (err, result) => {
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
    const { userId, index } = req.body;
    if (!userId ||!index)
        return res.status(400).send({ message: '缺少 userId 或 index 参数' });

    const sql = `
        UPDATE users
        SET address_list = JSON_REMOVE(address_list, CONCAT('$[', ?, ']'))
        WHERE id = ?
        AND JSON_LENGTH(address_list) > ?
    `;

    db.query(sql, [index, userId, index], (err, result) => {
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
