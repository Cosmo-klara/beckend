const express = require('express');
const router = express.Router();
const db = require('../db.js');
// 需求
// 查看，添加，删除
// 数据库关联：收藏id（需要设置为自增），用户id，驿站id，收藏时间

// 在选择用户收藏的时候触发，传入用户id查询收藏表展示收藏的驿站信息
router.post('/query', (req, res) => {
    const { user_id } = req.body;

    // 在收藏表favorites根据user_id查询对应全部条目，并根据其中的station_id在stations表中查询其所属驿站，返回驿站信息(驿站名称，地址，评分，营业时间)
    const sql = `
        SELECT
            s.station_id,
            s.station_name,
            s.address,
            s.score,
            s.business_hours,
            s.capacity,
            s.is_open
        FROM
            favorites f
        JOIN
            stations s ON f.station_id = s.station_id
        WHERE
            f.user_id = ?
    `;

    db.query(sql, [user_id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            // 返回无收藏
            return res.send({ message: 'No favorites' });
        }
        // 待测试，返回的 station_id 需要加载到本地变量（便于添加和删除）
        res.send({ favorite_list: result });
    });
});

// 添加收藏
router.post('/add', (req, res) => {
    const { user_id, station_id } = req.body;

    const sql = `INSERT INTO favorites (user_id, station_id) VALUES (?, ?)`;

    db.query(sql, [user_id, station_id], (err, result) => {
        if (err) {
            console.error('Error adding favorite:', err);
            return res.status(500).send({ message: 'Failed to add favorite' });
        }
        res.send({ message: 'Favorite added successfully'});
    });
});

// 移除收藏
router.post('/remove', (req, res) => {
    const { user_id, station_id } = req.body;

    const sql = `DELETE FROM favorites WHERE user_id =? AND station_id =?`;

    db.query(sql, [user_id, station_id], (err, result) => {
        if (err) {
            console.error('Error removing favorite:', err);
            return res.status(500).send({ message: 'Failed to remove favorite' });
        }
        res.send({ message: 'Favorite removed successfully'});
    })
})


module.exports = router;
