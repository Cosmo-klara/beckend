const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.post('/login', (req, res) => {
    const { id, password } = req.body;

    let tableName;
    if (id.length === 9) {
        tableName = 'users';
    } else if (id.length === 6) {
        tableName = 'station_managers';
    } else {
        return res.status(400).send('Invalid ID');
    }

    const sql = `SELECT * FROM ${tableName} WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(400).send('User not found');
        }
        const user = result[0];
        if (user.password !== password)
            return res.status(400).send('Incorrect password');

        res.send({ message: 'Login successful', user, role: tableName });
    });
});


router.post('/register', (req, res) => {
    const { role, id, password } = req.body;

    let tableName;
    if (role === 'user') {
        if (id.length !== 9)
            return res.status(400).send('Invalid ID Length');
        tableName = 'users';
    }else if (role === 'station_manager') {
        if (id.length!== 6)
            return res.status(400).send('Invalid ID Length');
        tableName = 'station_managers';
    }else {
        return res.status(400).send('Invalid role');
    }

    const sql = `INSERT INTO ${tableName} (id, password) VALUES (?, ?)`;

    db.query(sql, [id], [password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY')
                return res.status(400).send('ID already exists');
            throw err;
        }
        res.send({ message: 'Register successful' })
    });
});

module.exports = router;
