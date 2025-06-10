const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

// 注册路由
const authRoutes = require('./routes/auth');
const blockRoutes = require('./routes/block');
const favoriteRoutes = require('./routes/favorite');
const stationRoutes = require('./routes/station');
const userRoutes = require('./routes/user');
const managerRoutes = require('./routes/manager');
const commentRoutes = require('./routes/comment');
const waybillRoutes = require('./routes/waybill');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/block', blockRoutes);
app.use('/favorite', favoriteRoutes);
app.use('/station', stationRoutes);
app.use('/user', userRoutes);
app.use('/manager', managerRoutes);
app.use('/comment', commentRoutes);
app.use('/waybill', waybillRoutes);

app.use(express.static(path.join(__dirname, 'doc')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'doc', 'Interface_test.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
