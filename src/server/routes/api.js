var router = require('koa-router')();
// 此路由的前缀
router.prefix('/api');

router.get('/', async (ctx) => {
    ctx.body = {
        username: '张三',
        email: '123@qq.com'
    };
});

module.exports = router;