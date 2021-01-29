const { where } = require('sequelize');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var WebIm = require('../config/db.js');
var Friend = require('../models/friend.js')(WebIm, Sequelize);
var User = require('../models/user.js')(WebIm, Sequelize);
var Request = require('../models/request.js')(WebIm, Sequelize);

const getAllFriends = async function (ctx) {
    //console.log(ctx.state.user);
    let user = ctx.state.user;
    let rawFriends = await Friend.findAll({
        raw: true,  // 使sequlize只返回数据
        where: {
            [Op.or]: [{ uid1: user.id }, { uid2: user.id }],
        }
    });
    // console.log("rawFriends-------------------");
    // console.log(rawFriends);

    // 使用foreach会有错误，不知道为什么
    // rawFriends.forEach(async (rawFriend, index, array) => {
    //     //console.log(rawFriend);
    //     let friendId = (rawFriend.uid1 == user.id) ? rawFriend.uid2 : rawFriend.uid1;
    //     //console.log(friendId);
    //     let friend = await User.findOne({
    //         where: {
    //             id: friendId
    //         }
    //     });
    //     friends.push(friend);

    //     if(index === array.length - 1) {
    //         console.log("friends-------------------");
    //         console.log(friends);
    //         return friends;
    //     }
    // });

    // 暂时没用
    let friends = [];
    for (let i = 0; i < rawFriends.length; i++) {
        let rawFriend = rawFriends[i];
        //console.log("rawFriend------------------");
        //console.log(rawFriend);
        let friendId = (rawFriend.uid1 == user.id) ? rawFriend.uid2 : rawFriend.uid1;
        //console.log("friendId------------------");
        //console.log(friendId);
        let friend = await User.findOne({
            raw: true,
            where: {
                id: friendId
            }
        });
        //console.log("friends-------------------");
        friends.push(friend);
    }
    
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
    if(friend === null) {
        return {
            success: false,
            info: "该用户不存在！"
        }
    }

    // 检查是否两者已经是好友
    let isFriend = await Friend.findOne({
        where:{
            [Op.and]: [{ uid1: user.id }, { uid2: friend.id }],
        }
    });
    // 两人不是好友
    if(isFriend === null) {
        // 先不写
        // 对方已经还有一条好友请求没处理
        // const isRequested = await Request.findOne({

        // });

        // 创建一条未处理的好友请求
        const res = await Request.create({
            uid1: user.id,
            uid2: friend.id,
            date: Sequelize.literal('CURRENT_TIMESTAMP'),
            state: 0
        });
        
        // 创建请求成功
        if(res !== null) {
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

// 获取所有未处理好友请求
const getAllRequests = async function (ctx) {
    const user = ctx.state.user;
    const requests = Request.findAll({
        raw: true,
        where:{
            [Op.and]: [
                { uid2: user.id }, 
                { state: 0 },
            ],
        }
    });
    return requests;
}

module.exports = {
    getAllFriends,
    addFriend,
    getAllRequests,
}