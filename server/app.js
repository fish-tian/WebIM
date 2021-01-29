var Koa = require('koa');
//var Cookie = require('koa-cookie');

var app = new Koa();

// 中间件顺序很重要！！！！！！！！！！

// 配置koa session
// 在发布后需要替换为一个秘密的key，可以使用python生成
//>> import os 
//>> os.urandom(24)
var session = require('koa-session');
var RedisStore = require('koa-redis');

app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa.sess',
    maxAge: 86400000,   // cookie 的过期时间
    httpOnly: false,    // 只允许服务器访问，设为false
    signed: true,
    rolling: false,
    renew: false,
    store: new RedisStore() // 用 redis 存储 session
    //secure: true   // 用于https，开发阶段可以注释掉
};
app.use(session(CONFIG, app));

// bodyParser 不加这个无法读取 request body 的 json
var bodyParser = require('koa-bodyparser');
app.use(bodyParser());

// koa-passport
var passport = require('koa-passport');
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// 路由
// app.use(users.routes(), users.allowedMethods());
// 引入路由模块
var userApi = require('./routes/userApi');
var friendApi = require('./routes/friendApi');
app.use(userApi.routes(), userApi.allowedMethods());
app.use(friendApi.routes(), friendApi.allowedMethods());
//var index = require('./routes/index');
//app.use(index.routes(), index.allowedMethods());

app.listen(3000);