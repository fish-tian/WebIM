const { where } = require('sequelize');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var WebIm = require('../config/db.js');
var Friend = require('../models/friend.js')(WebIm, Sequelize);
var User = require('../models/user.js')(WebIm, Sequelize);
var Request = require('../models/request.js')(WebIm, Sequelize);
var Session = require('../models/session.js')(WebIm, Sequelize);
var Message = require('../models/message.js')(WebIm, Sequelize);
var SingleMember = require('../models/single_member.js')(WebIm, Sequelize);
var GroupMember = require('../models/group_member.js')(WebIm, Sequelize);
var Group = require('../models/group.js')(WebIm, Sequelize);

const io = require('../socket.js').getio();
const RedisStore = require('koa-redis')();

// 获取所有会话
const getAllSessions = async function (userId) {
    let sessions = [];
    // 所有单聊会话
    const sgMemberSessions = await SingleMember.findAll({
        raw: true,  // 使sequlize只返回数据
        where: {
            [Op.or]: [{ uid1: userId }, { uid2: userId }],
        }
    });

    for(const session of sgMemberSessions) {
        const friendId = session.uid1 === userId ? session.uid2 : session.uid1;
        const friend = await User.findOne({
            raw: true,
            where: {
                id: friendId
            }
        });

        //查询最后一条消息以及消息读的状态
        let lastMessage = await Message.findAll({
            attributes: ['message', 'read', 'sender_uid'],
            order: [['date', 'DESC']],
            limit: 1,
            raw: true,
            where: {
                sid: session.sid,
            }
        });

        //console.log(lastMessage);
        let lastMess, messRead, sender;
        if (lastMessage.length !== 0) {
            lastMess = lastMessage[0]["message"];
            messRead = lastMessage[0]["read"];
            sender = lastMessage[0]["sender_uid"];
        }

        let tempSession = {
            sid: session.sid,
            title: friend.user_name,
            group: 0,
            selfid: userId,
            fid: friend.id,
            message: lastMess,
            mesRead: messRead,
            send_uid: sender
        };
        // friend.selfid = user.id;
        // friend.fid = rawFriends[i].fid;
        // friend.sid = member.sid;
        // friend.message = lastMess[i];
        // friend.mesRead = messReads[i];
        // friend.send_uid = sender[i];

        sessions.push(tempSession);
    }

    // 所有群聊会话
    const gpMemberSessions = await GroupMember.findAll({
        raw: true,
        where: {
            uid: userId
        }
    });

    for(const session of gpMemberSessions) {
        const group = await Group.findOne({
            raw: true,
            where: {
                sid: session.sid
            }
        });

        //查询最后一条消息以及消息读的状态
        let lastMessage = await Message.findAll({
            attributes: ['message', 'read', 'sender_uid'],
            order: [['date', 'DESC']],
            limit: 1,
            raw: true,
            where: {
                sid: session.sid,
            }
        });

        //console.log(lastMessage);
        let lastMess, messRead, sender;
        if (lastMessage.length !== 0) {
            lastMess = lastMessage[0]["message"];
            //messRead = lastMessage[0]["read"]; 对于群聊不可用
            sender = lastMessage[0]["sender_uid"];
        }

        let tempSession = {
            sid: session.sid,
            group: 1,
            title: group.group_name,
            selfid: userId,
            // fid: friend.id,
            message: lastMess,
            //mesRead: messRead, 对于群聊不可用
            send_uid: sender
        };

        sessions.push(tempSession);
    }

    return sessions;
}

module.exports = {
    getAllSessions,
}