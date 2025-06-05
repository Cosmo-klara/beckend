const express = require('express');
const router = express.Router();
const db = require('../db.js');
// 需求
// 查看，修改，添加
// 数据库关联：管理者id

// 在选择用户收藏的时候触发，传入用户id查询收藏表
router.post('/query', (req, res) => {
    const { manager_id } = req.body;

    // 在收藏表favorites根据user_id查询对应全部条目，并根据其中的station_id在stations表中查询其所属驿站，返回驿站信息(驿站名称，地址，评分，营业时间)
    const sql = `
        SELECT * FROM stations WHERE manager_id = ?
    `;

    db.query(sql, [manager_id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.send({ message: 'No stasions' });
        }
        // 直接把查询到的数据全部返回——得测试接口看看数据长什么样
        res.send({ stations: result });
    });
});


// 添加驿站，传入 manager_id等参数，只有station_id自增不需要传入
router.post('/add', (req, res) => {
    const { manager_id,  } = req.body;

    const sql = `INSERT INTO stations (manager_id,) VALUES (?)`;

    db.query(sql, [user_id, station_id], (err, result) => {
        if (err) {
            console.error('Error removing favorite:', err);
            return res.status(500).send({ message: 'Failed to remove favorite' });
        }
        res.send({ message: 'Favorite removed successfully'});
    })
})


















module.exports = router;
