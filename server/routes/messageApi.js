const passport = require('koa-passport');
var MessageController = require('../controllers/MessageController');
var router = require('koa-router')();
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var WebIm = require('../config/db.js');
var Friend = require('../models/friend.js')(WebIm, Sequelize);
var User = require('../models/user.js')(WebIm, Sequelize);

// 此路由的前缀
router.prefix('/api');

// 获取所有消息
router.post('/message/getAll', async (ctx) => {
    if (ctx.isAuthenticated()) {
        console.log("-- getAllMessages");
        const res = await MessageController.getAllMessages(ctx.state.user.id, ctx.request.body.sid)
        ctx.body = {
            success: true,
            info: res,
        };
    } else {
        // 无法认证
        ctx.body = {
            success: false,
            info: "获取消息失败"
        };
        ctx.throw(401);
    }
});

// 发送消息
router.post('/message/sendMessage', async (ctx) => {
    if (ctx.isAuthenticated()) {
        console.log("-- sendMessage");
        const res = await MessageController.sendMessage(
                ctx.state.user.id,
                ctx.request.body.sid,
                ctx.request.body.message
            );
        ctx.body = {
            success: true,
            info: res,
        };
    } else {
        // 无法认证
        ctx.body = {
            success: false,
            info: "发送消息失败"
        };
        ctx.throw(401);
    }
});

// // 将该router暴露出去
module.exports = router;
