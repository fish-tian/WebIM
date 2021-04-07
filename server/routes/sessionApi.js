const passport = require('koa-passport');
var router = require('koa-router')();
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var WebIm = require('../config/db.js');
var Friend = require('../models/friend.js')(WebIm, Sequelize);
var User = require('../models/user.js')(WebIm, Sequelize);
var SessionController = require('../controllers/SessionController');

//var WebSocketController = require('../controllers/WebSocketController');

// 此路由的前缀
router.prefix('/api');

// 获取所有会话
router.get('/session/getAll', async (ctx) => {
    if (ctx.isAuthenticated()) {

        const res = await SessionController.getAllSessions(ctx.state.user.id);

        ctx.body = {
            success: true,
            info: res,
        };
    } else {
        // 无法认证
        ctx.body = {
            success: false,
            info: "获取会话失败"
        };
        ctx.throw(401);
    }
});

// // 将该router暴露出去
module.exports = router;