const express = require('express');
const router = express.Router();
const db = require('../db.js');

// 在选择用户收藏的时候触发，传入用户id查询收藏表展示收藏的驿站信息
router.post('/query', (req, res) => {
    const { userId } = req.body;
    if (!userId)
        return res.status(400).send({ message: '缺少 userId 参数' });

    // 在收藏表favorites根据user_id查询对应全部条目，并根据其中的station_id在stations表中查询其所属驿站，返回驿站信息(驿站名称，地址，评分，营业时间)
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
            favorites f
        JOIN
            stations s ON f.station_id = s.station_id
        WHERE
            f.user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) throw err;
        if (result.length === 0)
            return res.status(404).send({ message: '收藏为空' });
        res.send({ favorite_list: result });
    });
});

// 添加收藏
router.post('/add', (req, res) => {
    const { userId, stationId } = req.body;
    if (!userId || !stationId)
        return res.status(400).send({ message: '缺少 userId 或 stationId 参数' });

    const sql = `INSERT INTO favorites (user_id, station_id) VALUES (?, ?)`;

    db.query(sql, [userId, stationId], (err, result) => {
        if (err) {
            console.error('Error adding favorite:', err);
            return res.status(500).send({ message: '添加收藏失败' });
        }
        if (result.affectedRows === 0)
            return res.status(404).send({ message: '用户不存在或更新失败' });
        res.send({ message: '成功添加收藏'});
    });
});

// 移除收藏
router.post('/remove', (req, res) => {
    const { userId, stationId } = req.body;
    if (!userId ||!stationId)
        return res.status(400).send({ message: '缺少 userId 或 stationId 参数' });

    const sql = `DELETE FROM favorites WHERE user_id =? AND station_id =?`;

    db.query(sql, [userId, stationId], (err, result) => {
        if (err) {
            console.error('Error removing favorite:', err);
            return res.status(500).send({ message: '移除收藏失败' });
        }
        if (result.affectedRows === 0)
            return res.status(404).send({ message: '未找到该收藏记录' });
        res.send({ message: '成功移除收藏'});
    });
});


module.exports = router;
