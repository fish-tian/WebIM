const { where } = require('sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const WebIm = require('../config/db.js');
const Friend = require('../models/friend.js')(WebIm, Sequelize);
const User = require('../models/user.js')(WebIm, Sequelize);
const Request = require('../models/request.js')(WebIm, Sequelize);
const Session = require('../models/session.js')(WebIm, Sequelize);
const SingleMember = require('../models/single_member.js')(WebIm, Sequelize);
const GroupMember = require('../models/group_member.js')(WebIm, Sequelize);
const Message = require('../models/message.js')(WebIm, Sequelize);
const io = require('../socket.js').getio();
const RedisStore = require('koa-redis')();

// 获取sid所属会话的所有消息
const getAllMessages = async function(userId, sid) {
    //更改消息的状态改成已读
    // const mess = await Message.update(
    // {read:1},
    //     {where: {
    //         sender_uid:fid
    //     }
    // });

    // 属于该sid的所有消息
    let messages = await Message.findAll({
        raw: true,
        where: {
            sid: sid
        }
    });
   
    for (let message of messages) {
        // 查询消息发送者的用户名
        let sender = await User.findOne({
            raw: true,
            where: {
                id: message.sender_uid
            }
        });
        message.sender_name = sender.user_name;
        message.isMe = message.sender_uid == userId ? true : false;
    }
   
    return messages;
};

// 向sid所属会话发送消息
const sendMessage = async function (userId, sid, message) {
    const theMessage = await Message.create({
        sid: sid,
        sender_uid: userId,
        message: message,
        date: Date.now(),
        read: 0
    });

    const session = await Session.findOne({
        raw: true,
        where: {
            sid: sid
        }
    });

    let ids = [];
    if(!session.group) {    
        //该会话是单聊
        const sgMember = await SingleMember.findOne({
            raw: true,
            where: {
                sid: sid
            }
        });
        ids.push(sgMember.uid1 === userId ? sgMember.uid2 : sgMember.uid1);
    } else {
        //该会话是群聊
        const gpMembers = await GroupMember.findAll({
            raw: true,
            where: {
                sid: sid
            }
        });
        for(const member of gpMembers) {
            if(member.uid !== userId) {
                ids.push(member.uid);
            }
        }
    }
    
    // 存储 id与socket id 的映射
    let idAndSocketIds = [];
    for(const id of ids) {  
        const socketId = await RedisStore.get(id);
        if(socketId !== null && socketId !== undefined) {
            idAndSocketIds.push({
                id: id,
                socketId: socketId
            });
        }
    }

    // WebSocket 即时通知单聊好友或者群聊好友
    for(const idAndSocketId of idAndSocketIds) {
        var allMessages = await this.getAllMessages(idAndSocketId.id, sid);
        let data = {sid: sid, messages: allMessages};
        io.to(idAndSocketId.socketId).emit("newMessage", data);
    }
};

module.exports = {
    getAllMessages,
    sendMessage,
}