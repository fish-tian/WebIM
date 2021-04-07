const passport = require('koa-passport');
var GroupController = require('../controllers/GroupController');
var router = require('koa-router')();
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var WebIm = require('../config/db.js');
var Friend = require('../models/friend.js')(WebIm, Sequelize);
var User = require('../models/user.js')(WebIm, Sequelize);
//var WebSocketController = require('../controllers/WebSocketController');

// 此路由的前缀
router.prefix('/api');

// 添加用户
router.post('/group/addUser', async (ctx) => {
    if (ctx.isAuthenticated()) {
        const res = await GroupController.addUser(ctx);
        ctx.body = res;
    } else {
        // 无法认证
        ctx.body = {
            success: false,
            info: "添加用户失败"
        };
        ctx.throw(401);
    }
});

// 创建群聊
router.post('/group/createGroup', async (ctx) => {
    if (ctx.isAuthenticated()) {
        const res = await GroupController.createGroup(ctx);
        ctx.body = {
            success: true,
            info: "创建群聊成功"
        };
    } else {
        // 无法认证
        ctx.body = {
            success: false,
            info: "创建群聊失败"
        };
        ctx.throw(401);
    }
});

// // 将该router暴露出去
module.exports = router;