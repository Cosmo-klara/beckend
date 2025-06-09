const express = require('express');
const router = express.Router();
const db = require('../db.js');

const haversine = (lon1, lat1, lon2, lat2) => {
    const toRad = deg => deg * Math.PI / 180;
    const R = 6371000; // 地球半径
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const radLat1 = toRad(lat1);
    const radLat2 = toRad(lat2);
    const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// > 提供名字查询驿站接口（匹配包含）
router.post('/query_by_name', (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === '')
        return res.status(400).send({ message: 'name 参数不能为空' });

    const sql = `SELECT station_id FROM stations WHERE station_name LIKE CONCAT('%', ?, '%')`;

    db.query(sql, [name], (err, result) => {
        if (err) return res.status(500).send({ message: '服务器查询失败' });
        if (result.length === 0)
            return res.send({ message: '未找到匹配的驿站' });
        res.send({ stations: result });
    });
});



router.post('/query', (req, res) => {
    const { managerId, longitude, latitude } = req.body;

    const sql = `SELECT * FROM stations WHERE manager_id = ?`;
    db.query(sql, [managerId], (err, result) => {
        if (err) return res.status(500).send({ message: 'Server error' });
        if (result.length === 0)
            return res.send({ message: 'No stations' });
        // 添加距离字段
        const stationsWithDistance = result.map(station => {
            const lon = station.coordinates.x;
            const lat = station.coordinates.y;
            const distance = haversine(longitude, latitude, lon, lat);
            return {
                ...station,
                distance: parseFloat(distance.toFixed(0))
            };
        });

        stationsWithDistance.sort((a, b) => a.distance - b.distance);
        res.send({ stations: stationsWithDistance });
    });
});

router.post('/query_by_speed', (req, res) => {

});


router.post('/query_by_service', (req, res) => {

});


router.post('/query_by_price', (req, res) => {

});


// 计算一个加权的评分，初步定为 速度0.4 服务0.3 价格0.3
router.post('/query_by_avg', (req, res) => {

});









module.exports = router;