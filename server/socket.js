let io;
const RedisStore = require('koa-redis')();
const init = function (server) {
    // start socket.io server and cache io value
    io = require('socket.io')(server, {
        // 解决跨域
        cors: {
            origin: "http://localhost:8080",    // 如果需要局域网聊天，需要设置为局域网地址
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    // socket连接
    io.on('connection', (socket) => {
        console.log('-- user ' + socket.user.id +  '\'s websocket  connected');
        
        socket.on('disconnect', () => {
            // redis 进行清除
            RedisStore.destroy(socket.user.id);
            console.log('-- user ' + socket.user.id +  '\'s websocket disconnected');
        });
    });

    return io;
};

const getio = function () {
    // return previously cached value
    if (!io) {
        throw new Error("must call .init(server) before you can call .getio()");
    }
    return io;
};

module.exports = {
    init,
    getio,
}