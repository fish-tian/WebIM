// import auth from '../controllers/UserController.js'
// import koaRouter from 'koa-router'
var UserController = require('../controllers/UserController.js');
const router = require('koa-router')();

// 此路由的前缀
router.prefix('/auth');

router.get('/', async (ctx) => {
    ctx.body = '首页';
});

router.get('/admin', async (ctx) => {
    ctx.body = '管理';
});

router.get('/user/:id', UserController.getUserInfo) // 定义url的参数是id
router.post('/user', UserController.postUserAuth)

router.post('/user/register', UserController.register)
//router.get('/user', auth.getUserByName)

// 将该router暴露出去
module.exports = router;
