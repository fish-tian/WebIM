const {
    read
} = require('fs');
const {
    where
} = require('sequelize');
const Sequelize = require('sequelize');
const {
    QueryTypes
} = require('sequelize');
const Op = Sequelize.Op;
const WebIm = require('../config/db.js');
const friend = require('../models/friend.js');
const group = require('../models/group.js');
const Friend = require('../models/friend.js')(WebIm, Sequelize);
const User = require('../models/user.js')(WebIm, Sequelize);
const Request = require('../models/request.js')(WebIm, Sequelize);
const Session = require('../models/session.js')(WebIm, Sequelize);
const SingleMember = require('../models/single_member.js')(WebIm, Sequelize);
const GroupMember = require('../models/group_member.js')(WebIm, Sequelize);
const Message = require('../models/message.js')(WebIm, Sequelize);
const io = require('../socket.js').getio();
const RedisStore = require('koa-redis')();

// updateMessage = function(....userId..sid){
//     getAllMessages(userId); //yidu

//     data = getAllMessages(friendId, );
//     const socketId = await RedisStore.get(friendId);
//     io.to(socketId).emit("newMessage", data);

// }
// 获取sid所属会话的所有消息
//获取全部消息的时候就把自己收到的消息的状态改成已读
const getAllMessages = async function (userId, sid, flag) {
    //当flag==0时，说明是sendMsg调用此方法，此时的uid是对方的id,需要分别处理

    if (flag !== 0) {
        //console.log("当前用户的ID:" + userId);
        var mids = await Message.findAll({
            raw: true,
            attributes: ['mid', "sender_uid"],
            where: {
                read: 0,
                sid: sid,
                sender_uid: {
                    [Op.not]: userId
                }

            }
        })
    } else {
        var mids = await Message.findAll({
            raw: true,
            attributes: ['mid', "sender_uid"],
            where: {
                read: 0,
                sid: sid,
                sender_uid: userId

            }
        })
    }
    //查询会话是不是群聊，是群聊不更新已读未读
    let isGp = await Session.findOne({
        attributes: ['group'],
        where: {
            sid: sid
        }
    })

    for (let mid of mids) {
        //对方的ID
        let upMid = mid.mid;
        console.log("要更新MID为：" + upMid);
        if (isGp.group === 0) { //单聊
            var read = 1;
        } else {
            var read = 2; //群聊
        }

        const mess = await Message.update(
            {
                read: read
            },
            {
                where: {
                    // sid:sid,
                    // sender_uid:mid.sender_uid
                    mid: upMid
                }

            });



    }

    // 属于该sid的所有消息
    let messages = await Message.findAll({
        raw: true,
        where: {
            sid: sid,

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
    if (!session.group) {
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
        for (const member of gpMembers) {
            if (member.uid !== userId) {
                ids.push(member.uid);
            }
        }
    }
    // 存储 id与socket id 的映射
    let idAndSocketIds = [];
    for (const id of ids) {
        const socketId = await RedisStore.get(id);
        if (socketId !== null && socketId !== undefined) {
            idAndSocketIds.push({
                id: id,
                socketId: socketId
            });
        }
    }
    // WebSocket 即时通知单聊好友或者群聊好友
    for (const idAndSocketId of idAndSocketIds) {
        //发送消息时，设置一个flag,当flag==0时，不调用getMsg方法的更新已读/未读
        //let flag = 0;
        //var allMessages = await this.getAllMessages(idAndSocketId.id, sid, flag);
        
        // 仅发送一条消息
        let data = {
            sid: sid,
            message: theMessage,
        };

        io.to(idAndSocketId.socketId).emit("newMessage", data);
    }
};

const updateRead = async function (userId, sid, message) {
    const chat = await SingleMember.findOne({
        raw: true,
        where: {
            sid: sid
        }
    });
    let friendId;
    if (chat.uid1 === userId) {
        friendId = chat.uid2;
    } else {
        friendId = chat.uid1;
    }
    let ids = [];
    ids.push(friendId);
    ids.push(userId);
    // 暂时隐藏，调试
    // for (const id of ids) {

    //     const socketId = await RedisStore.get(id);

    //     let allMessages = await this.getAllMessages(id, sid);
    //     let data = {
    //         sid: sid,
    //         messages: allMessages,

    //     };
    //     io.to(socketId).emit("newMessage", data);

    // }
}

module.exports = {
    getAllMessages,
    sendMessage,
    updateRead
}