const Koa = require('koa');
//var Cookie = require('koa-cookie');

const app = new Koa();

// 中间件顺序很重要！！！！！！！！！！

// 配置koa session
// 在发布后需要替换为一个秘密的key，可以使用python生成
//>> import os 
//>> os.urandom(24)
const session = require('koa-session');
const RedisStore = require('koa-redis')();

app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa.sess',
    maxAge: 86400000,   // cookie 的过期时间
    httpOnly: false,    // 只允许服务器访问，设为false
    signed: true,
    rolling: false,
    renew: false,
    store: RedisStore // 用 redis 存储 session
    //secure: true   // 用于https，开发阶段可以注释掉
};
app.use(session(CONFIG, app));

// bodyParser 不加这个无法读取 request body 的 json
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

// koa-passport
const passport = require('koa-passport');
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// 配置 socket.io，以及整合 passport
const fs = require('fs');
const server = require('http').createServer(app.callback());
const io = require('./socket.js').init(server);    // 从外部文件中引用
const cookie = require('cookie');
const co = require('co');

// 结合使用 socket.io、passport
io.use((socket, next) => {
    if (!socket.handshake.headers.cookie) {
        //console.log("!!-- 有问题！");
        return next('Didn\'t receive cookies');
    }
    //console.log(socket.handshake.headers.cookie);
    let cookies = cookie.parse(socket.handshake.headers.cookie);
    co(function* () {
        console.log(cookies['koa.sess']);
        let curSession = yield RedisStore.get(cookies['koa.sess']);
        console.log(curSession);
        if (!curSession) {
            return next('Didn\'t find session for user. curSession id: ' + cookies['koa.sess']);
        }
        console.log(curSession.passport);
        passport.deserializeUser(curSession.passport.user, (error, user) => {
            if (!error && user) {
                socket.user = user;
                return next();
            }
            next('Authentication error.');
        });

    });
});

// 路由
// app.use(users.routes(), users.allowedMethods());
// 引入路由模块
const userApi = require('./routes/userApi.js');
const friendApi = require('./routes/friendApi.js');
const messageApi = require('./routes/messageApi.js');
const groupApi = require('./routes/groupApi.js');
const sessionApi = require('./routes/sessionApi.js');
app.use(userApi.routes(), userApi.allowedMethods());
app.use(friendApi.routes(), friendApi.allowedMethods());
app.use(messageApi.routes(), messageApi.allowedMethods());
app.use(groupApi.routes(), groupApi.allowedMethods());
app.use(sessionApi.routes(), sessionApi.allowedMethods());

// 监听端口
server.listen(3001, () => {
    console.log('- websocket listening on *:3001');
});

app.listen(3000, () => {
    console.log('- koa listening on *:3000');
});