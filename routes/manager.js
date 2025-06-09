const express = require('express');
const router = express.Router();
const db = require('../db.js');



// > 提供名字查询驿站接口（匹配包含）


router.post('/query', (req, res) => {
    const { managerId } = req.body;
    const sql = `SELECT * FROM stations WHERE manager_id = ?`;

    db.query(sql, [managerId], (err, result) => {
        if (err) throw err;
        if (result.length === 0)
            return res.send({ message: 'No stasions' });
        res.send({ stations: result });
    });
});

router.post('/add', (req, res) => {
    const {
        managerId,
        station_name,
        address,
        business_hours,
        business_area,
        capacity,
        is_open
    } = req.body;

    const sql = `INSERT INTO stations (manager_id, station_name, address, business_hours, business_area, capacity, is_open) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [managerId, station_name, address, business_hours, business_area, capacity, is_open], (err, result) => {
        if (err) {
            console.error('Error adding station:', err);
            return res.status(500).send({ message: 'Failed to add station' });
        }
        res.send({ message: 'Station added successfully' });
    });
});

// 修改驿站信息，传入 station_id, name, address, businessHours, capacity, isOpen等参数
// 这里感觉需要前端来处理传入的默认情况，也就是如果不修改的部分就就传入旧的信息（之前查询到的），用个form，默认值就是之前查询到的信息
router.post('/modify', (req, res) => {
    const { stationId, station_name, address, business_hours, business_area, capacity, is_open } = req.body;

    const sql = `UPDATE stations SET station_name = ?, address = ?, business_hours = ?, business_area = ?,capacity = ?, is_open = ? WHERE station_id = ?`;
    db.query(sql, [station_name, address, business_hours, business_area, capacity, is_open, stationId], (err, result) => {
        if (err) {
            console.error('Error updating station:', err);
            return res.status(500).send({ message: 'Failed to update station' });
        }
        if (result.affectedRows === 0)
            return res.status(404).send({ message: 'Station not found' });
        res.send({ message: 'Station updated successfully' });
    });
});

// 移除驿站
router.post('/remove', (req, res) => {
    const { stationId } = req.body;

    const sql = `DELETE FROM stations WHERE station_id =?`;
    db.query(sql, [stationId], (err, result) => {
        if (err) {
            console.error('Error deleting station:', err);
            return res.status(500).send({ message: 'Failed to delete station' });
        }
        if (result.affectedRows === 0)
            return res.status(404).send({ message: 'Station not found' });
        res.send({ message: 'Station deleted successfully' });
    })
})


module.exports = router;