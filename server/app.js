var Koa = require('koa');
//var Cookie = require('koa-cookie');

var app = new Koa();

// 中间件顺序很重要！！！！！！！！！！

// 配置koa session
// 在发布后需要替换为一个秘密的key，可以使用python生成
//>> import os 
//>> os.urandom(24)
var session = require('koa-session');
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa.sess',
    maxAge: 86400000,   // cookie 的过期时间
    httpOnly: false,    // 只允许服务器访问，设为false
    signed: true,
    rolling: false,
    renew: false,
    //secure: true   // 用于https，开发阶段可以注释掉
};
app.use(session(CONFIG, app));

// bodyParser 不加这个无法读取 request body 的 json
var bodyParser = require('koa-body-parser');
app.use(bodyParser());

// koa-passport
var passport = require('koa-passport');
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// 路由
// app.use(users.routes(), users.allowedMethods());
// 引入路由模块
var api = require('./routes/api');
app.use(api.routes(), api.allowedMethods());
//var index = require('./routes/index');
//app.use(index.routes(), index.allowedMethods());

app.listen(3000);