const passport = require('koa-passport');
//var UserController = require('../controllers/UserController.js');
var router = require('koa-router')();
const RedisStore = require('koa-redis')();
// 此路由的前缀
router.prefix('/api');

// 获取用户信息
//router.get('/user/:id', UserController.getUserInfo); // 定义url的参数是id

// 登录
router.post('/user', async (ctx) => {
    return passport.authenticate('local-signin', (err, user, info, status) => {
        //console.log("p111111111");
        if (err) {
            return next(err);
        }
        if (!user) {
            return ctx.body = {
                success: false,
                info: "用户名或密码错误"
            };
        } else {
            /* Note that when using a custom callback,
                it becomes the application's responsibility to 
                establish a session (by calling req.login()) and send a response.
            */
            // 更新redis
            RedisStore.set(user.id, ctx.request.body.socketId);
            //console.log("user id: " + user.id + " socketId:" + ctx.request.body.socketId);
            ctx.body = {
                success: true,
                info: "登录成功"
            };
            return ctx.login(user);
        }
    })(ctx);
});

// 注册
router.post('/user/register',
    async (ctx) => {
        return passport.authenticate('local-signup', (err, user, info, status) => {
            //console.log("p2222222");
            if (err) {
                return next(err);
            }
            if (!user) {
                return ctx.body = {
                    success: false,
                    info: "用户名已经存在"
                };
            } else {
                /* Note that when using a custom callback,
                   it becomes the application's responsibility to 
                   establish a session (by calling req.login()) and send a response.
                */
                // 更新redis
                RedisStore.set(user.id, ctx.request.body.socketId);
                ctx.body = {
                    success: true,
                    info: "注册成功"
                }

                return ctx.login(user);
            }
        })(ctx);
    }
);

//注销
router.get('/user/logout', async (ctx) => {
    if (ctx.isAuthenticated()) {
        // 进行passport注销
        ctx.logout();
        ctx.body = {
            success: true,
            info: "注销成功",
        };
    } else {
        // 无法认证
        ctx.body = {
            success: false,
            info: "注销失败"
        };
    }
});

// keepAlive // 用于在刷新页面或者重新打开页面时更新用户的socket.id
router.post('/user/keepAlive', async (ctx) => {
    if (ctx.isAuthenticated()) {
        //console.log("ctx.request.body");
        //console.log(ctx.request.body);
        // 更新redis
        RedisStore.set(ctx.state.user.id, ctx.request.body.socketId);
        console.log(ctx.state.user.user_name[0]);
        ctx.body = {
            success: true,
            info: "更新成功",
            username: ctx.state.user.user_name[0]
        };
    } else {
        ctx.body = {
            success: false,
            info: "无需更新"
        };
    }
});

// 将该router暴露出去
module.exports = router;