var Koa = require('koa');
//var Cookie = require('koa-cookie');

var app = new Koa();

// 中间件顺序很重要！！！！！！！！！！

// 配置koa session
// 在发布后需要替换为一个秘密的key，可以使用python生成
//>> import os 
//>> os.urandom(24)
var session = require('koa-session');
var RedisStore = require('koa-redis')();

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
var userApi = require('./routes/userApi.js');
var friendApi = require('./routes/friendApi.js');
app.use(userApi.routes(), userApi.allowedMethods());
app.use(friendApi.routes(), friendApi.allowedMethods());

// 配置 socket.io，以及整合 passport
var fs = require('fs');
var server = require('http').createServer(app.callback());
var io = require('socket.io')(server, {
    // 解决跨域
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
var cookie = require('cookie');
var co = require('co');

io.use((socket, next) => {
    if (!socket.handshake.headers.cookie) {
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

        passport.deserializeUser(curSession.passport.user, (error, user) => {
            if (!error && user) {
                console.log(user);
                socket.user = user;
                return next();
            }
            next('Authentication error.');
        });

    })
});
// socket连接
io.on('connection', (socket) => {
    console.log('websocket user connected---------------------------');
    socket.on('pingServer', (msg) => {
        console.log('message: '+msg);
        io.emit("messageChannel", 'FFFFFFFFFFFFFFF');
    });
    socket.on('disconnect', () => {
        console.log('websocket user disconnected-------------------');
    });
});

//var WebSocketController = require('./controllers/WebSocketController')(io);

// 监听端口
server.listen(3001, () => {
    console.log('websocket listening on *:3001');
});

app.listen(3000, () => {
    console.log('koa listening on *:3000');
});