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

router.post('/query_by_name', (req, res) => {
    const { name, longitude, latitude, userId } = req.body;

    if (!name || name.trim() === '')
        return res.status(400).send({ message: 'name 参数不能为空' });
    if (!longitude || !latitude)
        return res.status(400).send({ message: 'longitude 和 latitude 参数不能为空' });
    if (!userId)
        return res.status(400).send({ message: '缺少 userId 参数' });

    const sql = `
        SELECT s.*
        FROM stations s
        LEFT JOIN blocks b ON s.station_id = b.station_id AND b.user_id = ?
        WHERE s.station_name LIKE CONCAT('%', ?, '%')
        AND b.user_id IS NULL
    `;

    db.query(sql, [userId, name], (err, result) => {
        if (err) {
            console.error('查询错误:', err);
            return res.status(500).send({ message: '服务器查询失败' });
        }
            if (result.length === 0)
            return res.send({ message: '未找到匹配的驿站或所有匹配的驿站已被屏蔽' });
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
        res.send({ stations: stationsWithDistance.slice(0, 5)});
    });
});

router.post('/query', (req, res) => {
    const { longitude, latitude, userId } = req.body;
    if (!longitude ||!latitude)
        return res.status(400).send({ message: 'longitude 和 latitude 参数不能为空' });
    if (!userId)
        return res.status(400).send({ message: '缺少 userId 参数' });

    const sql = `
        SELECT s.*
        FROM stations s
        LEFT JOIN blocks b ON s.station_id = b.station_id AND b.user_id = ?
        WHERE b.user_id IS NULL
    `;
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('查询错误:', err);
            return res.status(500).send({ message: '服务器查询失败' });
        }
        if (result.length === 0)
            return res.send({ message: '未找到匹配的驿站或所有驿站已被屏蔽' });
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
        res.send({ stations: stationsWithDistance.slice(0, 5)});
    });
});

module.exports = router;