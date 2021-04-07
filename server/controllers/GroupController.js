const { where } = require('sequelize');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var WebIm = require('../config/db.js');
var User = require('../models/user.js')(WebIm, Sequelize);
var Session = require('../models/session.js')(WebIm, Sequelize);
var Group = require('../models/group.js')(WebIm, Sequelize);
var GroupMember = require('../models/group_member.js')(WebIm, Sequelize);

const io = require('../socket.js').getio();
const RedisStore = require('koa-redis')();

var SessionController = require('../controllers/SessionController');


const addUser = async function (ctx) {
    const user = ctx.state.user;
    const friendName = ctx.request.body.friendName;
    const friend = await User.findOne({
        raw: true,
        where: {
            user_name: friendName
        }
    });

    // 不存在该用户
    if (friend === null) {
        return {
            success: false,
            info: "该用户不存在！"
        }
    }

    // 自己添加自己
    if (user.id === friend.id) {
        return {
            success: false,
            info: "不能邀请自己!"
        }
    }

    return {
        success: true,
        info: friend
    }
};

// 创建群聊
const createGroup = async function (ctx) {
    const user = ctx.state.user;
    const users = ctx.request.body.users;

    // 创建一个新会话
    const newSession = await Session.create({ group: 1 });
    // 创建一个新群聊
    const newGroup = await Group.create({
        sid: newSession.sid,
        group_name: user.user_name + "创建的群聊",
        owner_uid: user.id
    });
    // 在群聊成员表中添加所有用户
    for(let i = 0; i < users.length; i++) {
        const res = await GroupMember.create({
            uid: users[i].id,
            sid: newSession.sid,
            unread_cnt: 0
        });
    }
    // 也要添加本用户
    const res = await GroupMember.create({
        uid: user.id,
        sid: newSession.sid,
        unread_cnt: 0
    });

    for(const item of users) {
        const allSessions = await SessionController.getAllSessions(item.id);
        const socketId = await RedisStore.get(item.id);
        if(socketId !== null && socketId !== undefined) {
            io.to(socketId).emit("newSession", allSessions);
        }
    }
}

module.exports = {
    addUser,
    createGroup
}