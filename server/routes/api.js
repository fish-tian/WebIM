const passport = require('koa-passport');
//var UserController = require('../controllers/UserController.js');
var router = require('koa-router')();
// 此路由的前缀
router.prefix('/api');

// 获取用户信息
//router.get('/user/:id', UserController.getUserInfo); // 定义url的参数是id

// 登录
router.post('/user', async (ctx) => {
    return passport.authenticate('local-signin', (err, user, info, status) => {
        console.log("p111111111");
        if (err) {
            return next(err);
        }
        if (!user) {
            return ctx.body = {
                success: false,
                info: "登录失败"
            };
        } else {
            /* Note that when using a custom callback,
                it becomes the application's responsibility to 
                establish a session (by calling req.login()) and send a response.
            */
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
    // passport.authenticate('local-signup', {
    //     successRedirect: '/',
    //     failureRedirect: '/login'
    // }
    async (ctx) => {
        return passport.authenticate('local-signup', (err, user, info, status) => {
            console.log("p2222222");
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
                ctx.body = {
                    success: true,
                    info: "注册成功"
                }

                return ctx.login(user);;
            }
        })(ctx);
    }
);

// 测试某个接口是否可以访问
router.get('/user/testGetFriends', async (ctx) => {
    if (ctx.isAuthenticated()) {
        // 调用某个controller
        
        ctx.body = {
            success: true,
            info: "成功",
            friends: [
                {
                    userId: 2,
                    username: "尼古拉斯·小磊",
                    userAvatar: "avatar1.jpeg"
                },
                {
                    userId: 3,
                    username: "莱昂纳多·小虎",
                    userAvatar: "avatar2.jpeg"
                },
                {
                    userId: 4,
                    username: "克里斯蒂安·小恒",
                    userAvatar: "avatar3.jpeg"
                }
            ]
        }
    } else {
        // 无法认证
        ctx.body = {
            success: false,
            info: "失败"
        }
    }
})

// 将该router暴露出去
module.exports = router;