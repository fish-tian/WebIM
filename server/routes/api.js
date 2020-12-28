var UserController = require('../controllers/UserController.js');
var router = require('koa-router')();
// 此路由的前缀
router.prefix('/api');

// 获取用户信息
router.get('/user/:id', UserController.getUserInfo) // 定义url的参数是id
// 登录
router.post('/user', UserController.postUserAuth)
// 注册
router.post('/user/register', UserController.register)

// 将该router暴露出去
module.exports = router;