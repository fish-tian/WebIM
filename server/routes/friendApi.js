const passport = require('koa-passport');
var FriendController = require('../controllers/FriendController');
var router = require('koa-router')();
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var WebIm = require('../config/db.js');
var Friend = require('../models/friend.js')(WebIm, Sequelize);
var User = require('../models/user.js')(WebIm, Sequelize);

// 此路由的前缀
router.prefix('/api');

// 获取所有好友
router.get('/friend/getAll', async (ctx) => {
    if (ctx.isAuthenticated()) {
        // 版本1
        const res = await FriendController.getAllFriends(ctx)
        console.log("getAllFriend---------------");
        console.log(res);
        ctx.body = {
            success: true,
            info: res
        };
    } else {
        // 无法认证
        ctx.body = {
            success: false,
            info: "获取好友失败"
        };
        ctx.throw(401);
    }
});

router.post('/friend/addFriend', async (ctx) => {
    if(ctx.isAuthenticated()) {
        console.log("ctx.request.body");
        console.log(ctx.request.body);
        const res = await FriendController.addFriend(ctx);
        console.log(res);
        ctx.body = res;
    } else {
        // 无法认证
        ctx.body = {
            success: false,
            info: "添加好友失败"
        };
        ctx.throw(401);
    }
});

// 将该router暴露出去
module.exports = router;