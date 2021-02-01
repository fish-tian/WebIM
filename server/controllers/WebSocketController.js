// 引入 socket.io !!!!!!!!!!!!!!!!!!
var io;
module.exports = function(importIO) {
    io = importIO;
}

io.emit("messageChannel", 'test\n!!!!!!!!!!!!!');