let io;
module.exports = {
    init: function (server) {
        // start socket.io server and cache io value
        io = require('socket.io')(server, {
            // 解决跨域
            cors: {
                origin: "http://localhost:8080",
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        // socket连接
        io.on('connection', (socket) => {
            console.log('-- websocket user connected');
            
            socket.on('disconnect', () => {
                console.log('-- websocket user disconnected');
            });
        });

        return io;
    },
    getio: function () {
        // return previously cached value
        if (!io) {
            throw new Error("must call .init(server) before you can call .getio()");
        }
        return io;
    }
}