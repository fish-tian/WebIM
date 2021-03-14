const passport = require('koa-passport');
var SingleMessageController = require('../controllers/SingleMessageController');
var router = require('koa-router')();
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var WebIm = require('../config/db.js');
var Friend = require('../models/friend.js')(WebIm, Sequelize);
var User = require('../models/user.js')(WebIm, Sequelize);

// 此路由的前缀
router.prefix('/api');

// 获取与某好友的所有消息
router.post('/sgMessage/getAll', async (ctx) => {
    if (ctx.isAuthenticated()) {
        console.log("-- getAllMessages");
        const res = await SingleMessageController.getAllMessages(ctx) 
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
router.post('/sgMessage/sendMessage', async (ctx) => {
    if (ctx.isAuthenticated()) {
        console.log("-- sendMessage");
        const res = await SingleMessageController.sendMessage(ctx); 
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

// // 将该router暴露出去
module.exports = router;
