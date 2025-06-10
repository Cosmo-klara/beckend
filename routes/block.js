const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.post('/query', (req, res) => {
    const { userId } = req.body;
    if (!userId)
        return res.status(400).send({ message: '缺少 userId 参数' });

    const sql = `
        SELECT
            s.station_id,
            s.station_name,
            s.address,
            s.speed_score,
            s.service_score,
            s.price_score,
            s.business_hours,
            s.is_open
        FROM
            blocks b
        JOIN
            stations s ON b.station_id = s.station_id
        WHERE
            b.user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) throw err;
        if (result.length === 0)
            return res.status(404).send({ message: '屏蔽为空' });
        res.send({ block_list: result });
    });
});

router.post('/add', (req, res) => {
    const { userId, stationId } = req.body;
    if (!userId || !stationId)
        return res.status(400).send({ message: '缺少参数' });

    const sql = `INSERT INTO blocks (user_id, station_id) VALUES (?, ?)`;

    db.query(sql, [userId, stationId], (err, result) => {
        if (err) {
            console.error('Error adding block:', err);
            return res.status(500).send({ message: '添加屏蔽失败' });
        }
        if (result.affectedRows === 0)
            return res.status(404).send({ message: '用户不存在或更新失败' });
        res.send({ message: '成功添加屏蔽'});
    });
});

router.post('/remove', (req, res) => {
    const { userId, stationId } = req.body;

    const sql = `DELETE FROM blocks WHERE user_id =? AND station_id =?`;

    db.query(sql, [userId, stationId], (err, result) => {
        if (err) {
            console.error('Error removing block:', err);
            return res.status(500).send({ message: '移除屏蔽失败' });
        }
        if (result.affectedRows === 0)
            return res.status(404).send({ message: '未找到该屏蔽记录' });
        res.send({ message: '成功移除收藏'});
    });
});


module.exports = router;