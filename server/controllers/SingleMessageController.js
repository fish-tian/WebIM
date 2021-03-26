const { where } = require('sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const WebIm = require('../config/db.js');
const single_member = require('../models/single_member.js');
const Friend = require('../models/friend.js')(WebIm, Sequelize);
const User = require('../models/user.js')(WebIm, Sequelize);
const Request = require('../models/request.js')(WebIm, Sequelize);
const Session = require('../models/session.js')(WebIm, Sequelize);
const SingleMember = require('../models/single_member.js')(WebIm, Sequelize);
const Message = require('../models/message.js')(WebIm, Sequelize);
const io = require('../socket.js').getio();
const RedisStore = require('koa-redis')();

// 获取 user 与 friend 的所有单聊消息
const getAllMessages = async function (ctx) {
    const user = ctx.state.user;
    // const friend = ctx.request.body.friend;
    // 前端friend保存了会话ID sid
    const sid = ctx.request.body.sid;

    // 属于该sid的所有消息
    let messages = await Message.findAll({
        raw: true,
        where: {
            sid: sid
        }
    });

    for (let message of messages) {
        message.isMe = message.sender_uid == user.id ? true : false;
    }

    return messages;
};

// 发送单聊消息
const sendMessage = async function (ctx) {
    const user = ctx.state.user;
    const friend = ctx.request.body.friend;
    const message = ctx.request.body.message;
    const sid = friend.sid;

    console.log("--- message is:" + message);

    // 创建message
    const theMessage = await Message.create({
        sid: sid,
        sender_uid: user.id,
        message: message,
        date: Date.now(),
        read: 0
    });

    console.log("--- theMessage.message is:" + theMessage.message);

    // 如果对方在线，WebSocket 即时通知该好友
    const friendId = friend.id;
    const socketId = await RedisStore.get(friendId);
    if (socketId !== null) {
        console.log(socketId);
        //console.log("friendId:" + friendId + " socketId:" + socketId);
        var fakeCtx = ctx;
        fakeCtx.state.user.id = friendId;
        fakeCtx.request.body.sid = sid;
        var allMessages = await this.getAllMessages(fakeCtx);
        //console.log(allMessages);
        io.to(socketId).emit("newMessage", allMessages);
    }
};

module.exports = {
    getAllMessages,
    sendMessage,
}