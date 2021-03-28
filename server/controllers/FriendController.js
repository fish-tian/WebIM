const { where } = require('sequelize');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var WebIm = require('../config/db.js');
const single_member = require('../models/single_member.js');
var Friend = require('../models/friend.js')(WebIm, Sequelize);
var User = require('../models/user.js')(WebIm, Sequelize);
var Request = require('../models/request.js')(WebIm, Sequelize);
var Session = require('../models/session.js')(WebIm, Sequelize);
var Message = require('../models/message.js')(WebIm, Sequelize);
var SingleMember = require('../models/single_member.js')(WebIm, Sequelize);
const io = require('../socket.js').getio();
const RedisStore = require('koa-redis')();

const getAllFriends = async function (ctx) {
    // console.log(ctx.request.user);
    let user = ctx.state.user;
    let rawFriends = await Friend.findAll({
        raw: true,  // 使sequlize只返回数据
        where: {
            [Op.or]: [{ uid1: user.id }, { uid2: user.id }],
        }
    });


    let friends = []; var lastMess = [];
    let messReads = [];
    let sender = [];
    for (let i = 0; i < rawFriends.length; i++) {
        let rawFriend = rawFriends[i];

        let friendId = (rawFriend.uid1 == user.id) ? rawFriend.uid2 : rawFriend.uid1;



        let friend = await User.findOne({

            raw: true,
            where: {
                id: friendId
            }
        });
        let member = await SingleMember.findOne({
            where: {
                uid1: friendId < user.id ? friendId : user.id,
                uid2: friendId < user.id ? user.id : friendId,
            }
        });
        //查询最后一条消息以及消息读的状态

        let lastMessage = await Message.findAll({
            attributes: ['message', 'read', 'sender_uid'],
            order: [['date', 'DESC']],
            limit: 1,
            raw: true,
            where: {
                sid: member.sid,
            }

        });

        console.log(lastMessage);
        // if (lastMessage !== null) {
        //     // WebSocket发送请求
        //     var socketId = await RedisStore.get(friend.id);
        //     if (socketId !== undefined) {
        //         var fakeCtx = ctx;
        //         fakeCtx.state.user.id = friend.id;
        //         var allRequests = await this.getAllRequests(fakeCtx);
        //         io.to(socketId).emit("lastMeg", allRequests);
        //     }

        // }
        if (lastMessage.length !== 0) {
            lastMess.push(lastMessage[0]["message"]);
            messReads.push(lastMessage[0]["read"]);
            sender.push(lastMessage[0]["sender_uid"]);
        }
        friend.selfid = ctx.state.user.id;//拿到本人的ID
        friend.fid = rawFriends[i].fid;
        friend.sid = member.sid;
        friend.message = lastMess[i];
        friend.mesRead = messReads[i];
        friend.send_uid = sender[i];


        friends.push(friend);
    }

    console.log(friends);

    return friends;
}

const addFriend = async function (ctx) {
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
            info: "你不能添加自己为好友!"
        }
    }

    // 检查是否两者已经是好友
    let isFriend = await Friend.findOne({
        where: {
            [Op.and]: [{ uid1: user.id }, { uid2: friend.id }],
        }
    });
    let isFriend2 = await Friend.findOne({
        where: {
            [Op.and]: [{ uid1: friend.id }, { uid2: user.id }],
        }
    });
    //console.log("py?" + isFriend)
    //console.log(user.id + " ")

    // 检查请求是否重复, 此处不需要检查两次, 因为好友请求是单向的(所以好友请求存储也不应该优化为uid从小到大排序后存储).
    let requestDup = await Request.findOne({
        where: {
            [Op.and]: [{ uid1: user.id }, { uid2: friend.id }, { state: 0 }],
        }
    });

    // 两人不是好友并且这个好友请求未重复
    if (isFriend === null && isFriend2 === null) {

        // 创建一条未处理的好友请求
        let res = null;
        const requestInfo = {
            uid1: user.id,
            uid2: friend.id,
            date: Sequelize.literal('CURRENT_TIMESTAMP'),
            state: 0
        }
        if (requestDup === null) {
            res = await Request.create(requestInfo);
        } else {
            res = await Request.update(requestInfo, {
                where: {
                    rid: requestDup.rid
                }
            });
        }


        // 创建请求成功
        if (res !== null) {
            // WebSocket发送请求
            var socketId = await RedisStore.get(friend.id);
            if (socketId !== undefined) {
                var fakeCtx = ctx;
                fakeCtx.state.user.id = friend.id;
                var allRequests = await this.getAllRequests(fakeCtx);
                io.to(socketId).emit("newRequest", allRequests);
            }

            return {
                success: true,
                info: "好友请求发送成功！"
            }
        }
        // 创建请求失败 
        else {
            return {
                success: false,
                info: "好友请求发送失败！"
            }
        }
    }
    // 两人是好友
    else {
        return {
            success: false,
            info: "你们已经是好友了！"
        }
    }
}

// 同意好友请求
const passRequest = async function (ctx) {
    let rid = ctx.request.body.rid;
    let uid1 = ctx.request.body.uid1;
    let uid2 = ctx.request.body.uid2;
    // 小的id作为uid1
    if (uid1 > uid2) {
        let temp = uid2;
        uid2 = uid1;
        uid1 = temp;
    }

    // 更新好友请求为已处理状态
    const result = await Request.update(
        { 'state': 1 },
        { 'where': { 'rid': rid } }
    );
    // 创建好友关系
    const result2 = await Friend.create({
        uid1: uid1,
        uid2: uid2,
        // date: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
    // 创建一个新会话
    const newSession = await Session.create({ group: 0 });
    // 在单聊成员表中添加一行
    const result3 = await SingleMember.findOne({
        where: {
            [Op.and]: [{ uid1: uid1 }, { uid2: uid2 }],
        }
    });
    if (result3 == null) {
        //const newSingleMember = 
        await SingleMember.create({
            uid1: uid1,
            uid2: uid2,
            sid: newSession.sid,
            unread_cnt: 0,
        });
    }

    // WebSocket 通知该好友
    var friendId = uid1 == ctx.state.user.id ? uid2 : uid1;
    var socketId = await RedisStore.get(friendId);
    // console.log(socketId);
    var fakeCtx = ctx;
    fakeCtx.state.user.id = friendId;
    var allFriends = await this.getAllFriends(fakeCtx);
    // console.log("friends:" + allFriends);
    io.to(socketId).emit("newFriend", allFriends);

    return result2; // 返回一个数组，更新成功的条目为1否则为0。由于只更新一个条目，所以只返回一个元素
}

// 拒绝好友请求
const rejectRequest = async function (ctx) {
    let rid = ctx.request.body.rid//这句很重要

    const result = await Request.update(
        {
            'state': 2//2代表拒绝
        },
        {
            'where': { 'rid': rid }
        }
    )
    //console.log(result)
    //return result===1
    return result[0] === 1; // 返回一个数组，更新成功的条目为1否则为0。由于只更新一个条目，所以只返回一个元素
}

//删除好友
const delFriend = async function (ctx) {
    let fid = ctx.request.body.fid;
    const friend = await Friend.findOne({
        where: {
            fid
        }
    });
    // 删除该条好友关系
    const result = await Friend.destroy({
        where: {
            fid
        }
    });
    // 删除会话以及会话成员，暂时不实现

    // WebSocket 通知该好友
    var friendId = friend.uid1 == ctx.state.user.id ? friend.uid2 : friend.uid1;
    var socketId = await RedisStore.get(friendId);
    //console.log("friendId:" + friendId + " socketId:" + socketId);
    var fakeCtx = ctx;
    fakeCtx.state.user.id = friendId;
    var allFriends = await this.getAllFriends(fakeCtx);
    //console.log(allFriends);
    io.to(socketId).emit("newFriend", allFriends);

    return result[0] === 1 // 返回一个数组，更新成功的条目为1否则为0。由于只更新一个条目，所以只返回一个元素
}

// 获取所有未处理好友请求
const getAllRequests = async function (ctx) {
    // passport 提供支持，获取当前用户
    const user = ctx.state.user;
    const requests = await Request.findAll({
        raw: true,
        where: {
            [Op.and]: [
                { uid2: user.id },
                { state: 0 },
            ],
        }
    });

    let res = requests;
    for (let i = 0; i < requests.length; i++) {
        const userTemp = await User.findOne({
            raw: true,
            where: {
                id: requests[i].uid1
            }
        });
        res[i].uid1Name = userTemp.user_name;
    }
    return res;
}

module.exports = {
    getAllFriends,
    addFriend,
    getAllRequests,
    passRequest,
    rejectRequest,
    delFriend,

}