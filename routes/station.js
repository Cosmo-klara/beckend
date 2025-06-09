const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.post('/query', (req, res) => {
    const { manager_id } = req.body;

    // 根据manager_id查询对应全部条目，并根据其中的station_id在stations表中查询其所属驿站，返回驿站信息(驿站名称，地址，评分，营业时间)
    const sql = `
        SELECT * FROM stations WHERE manager_id = ?
    `;

    db.query(sql, [manager_id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.send({ message: 'No stasions' });
        }
        // 直接把查询到的数据全部返回——得测试接口看看数据长什么样
        // 返回的 station_id 需要加载到本地变量（便于添加和删除）
        res.send({ stations: result });
    });
});


// 添加驿站，传入 manager_id, name, address, businessHours, capacity, isOpen等参数，只有station_id自增不需要传入，
router.post('/add', (req, res) => {
    const { manager_id, station_name, address, business_hours, capacity, is_open } = req.body;

    const sql = `INSERT INTO stations (manager_id, station_name, address, business_hours, capacity, is_open) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [manager_id, station_name, address, business_hours, capacity, is_open], (err, result) => {
        if (err) {
            console.error('Error adding station:', err);
            return res.status(500).send({ message: 'Failed to add station' });
        }
        res.send({ message: 'Station added successfully'});
    });
});

// 修改驿站信息，传入 station_id, name, address, businessHours, capacity, isOpen等参数
// 这里感觉需要前端来处理传入的默认情况，也就是如果不修改的部分就就传入旧的信息（之前查询到的），用个form，默认值就是之前查询到的信息
router.post('/modify', (req, res) => {
    const { station_id, station_name, address, business_hours, capacity, is_open } = req.body;

    const sql = `UPDATE stations SET station_name = ?, address = ?, business_hours = ?, capacity = ?, is_open = ? WHERE station_id = ?`;
    db.query(sql, [station_name, address, business_hours, capacity, is_open, station_id], (err, result) => {
        if (err) {
            console.error('Error updating station:', err);
            return res.status(500).send({ message: 'Failed to update station' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Station not found' });
        }
        res.send({ message: 'Station updated successfully' });
    });
});
















module.exports = router;
