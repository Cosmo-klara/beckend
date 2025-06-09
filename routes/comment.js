const express = require('express');
const router = express.Router();
const db = require('../db.js');

// 查看驿站所有评价
router.post('/query', (req, res) => {
    const { stationId } = req.body;

    if (!stationId) {
        return res.status(400).send({ message: '缺少 stationId 参数' });
    }

    const sql = `
        SELECT
            comment_id,
            user_id,
            speed_score,
            service_score,
            price_score,
            comment_content,
            timestamp
        FROM comments
        WHERE station_id = ?
        ORDER BY timestamp DESC
    `;

    db.query(sql, [stationId], (err, result) => {
        if (err) {
            console.error('查询失败:', err);
            return res.status(500).send({ message: '查询失败' });
        }
        res.send(result);
    });
});


// 查看我的评价
router.post('/query_mine', (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).send({ message: '缺少 userId 参数' });
    }

    const sql = `
        SELECT
            comment_id,
            station_id,
            speed_score,
            service_score,
            price_score,
            comment_content,
            timestamp
        FROM comments
        WHERE user_id = ?
        ORDER BY timestamp DESC
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('查询失败:', err);
            return res.status(500).send({ message: '查询失败' });
        }
        res.send(result);
    });
});


// 添加评价
router.post('/add', (req, res) => {
    const {
        userId,
        stationId,
        speed_score,
        service_score,
        price_score,
        comment_content
    } = req.body;

    if (!userId || !stationId || !speed_score || !service_score || !price_score) {
        return res.status(400).send({ message: '缺少必要评分或用户信息' });
    }

    const sql = `
        INSERT INTO comments (
            user_id, station_id,
            speed_score, service_score, price_score,
            comment_content
        ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [userId, stationId, speed_score, service_score, price_score, comment_content], (err, result) => {
        if (err) {
            console.error('添加失败:', err);
            return res.status(500).send({ message: '添加评价失败' });
        }
        res.send({ message: '评价添加成功', commentId: result.insertId });
    });
});


// 删除评价
router.post('/delete', (req, res) => {
    const { commentId, userId } = req.body;

    if (!commentId || !userId) {
        return res.status(400).send({ message: '缺少 commentId 或 userId 参数' });
    }

    const sql = `
        DELETE FROM comments
        WHERE comment_id = ? AND user_id = ?
    `;

    db.query(sql, [commentId, userId], (err, result) => {
        if (err) {
            console.error('删除失败:', err);
            return res.status(500).send({ message: '删除失败' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: '找不到该评论或无权限删除' });
        }

        res.send({ message: '评论删除成功' });
    });
});





















module.exports = router;