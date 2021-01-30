const { where } = require('sequelize');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var WebIm = require('../config/db.js');
var Friend = require('../models/friend.js')(WebIm, Sequelize);
var User = require('../models/user.js')(WebIm, Sequelize);
var Request = require('../models/request.js')(WebIm, Sequelize);
//删除要用到fid，所以需要好友列表
const getAllFriendsList = async function (ctx) {
    //console.log(ctx.state.user);
    let user = ctx.state.user;
    let rawFriends = await Friend.findAll({
        raw: true,  // 使sequlize只返回数据
        where: {
            [Op.or]: [{ uid1: user.id }, { uid2: user.id }],
        }
    });
     console.log("rawFriends1-------------------");
     console.log(rawFriends);
     return rawFriends;

}

const getAllFriends = async function (ctx) {
    //console.log(ctx.state.user);
    let user = ctx.state.user;
    let rawFriends = await Friend.findAll({
        raw: true,  // 使sequlize只返回数据
        where: {
            [Op.or]: [{ uid1: user.id }, { uid2: user.id }],
        }
    });
     

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
    let isFriend2 = await Friend.findOne({
        where:{
            [Op.and]: [{ uid1: friend.id }, { uid2: user.id }],
        }
    });
    console.log("py?"+isFriend)
    console.log(user.id+" ")

    // 检查请求是否重复, 此处不需要检查两次, 因为好友请求是单向的(所以好友请求存储也不应该优化为uid从小到大排序后存储).
    let requestDup = await Request.findOne({
        where: {
            [Op.and]: [{uid1: user.id}, {uid2: friend.id}],
        }
    });

    // 两人不是好友并且这个好友请求未重复
    if(isFriend === null && isFriend2 === null && requestDup === null) {
       
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
    // 两人是好友 或者 好友请求重复(此时仍然返回true, 但不向数据库插入数据了防止好友请求列表出现多个相同好友请求)
    else {
        if (requestDup) {
            return {
                success: true,
                info: "好友请求发送成功！"
            }
        }
        else {
            return {
                success: false,
                info: "你们已经是好友了！"
            }
        }
    }
}
//pass
const passRequest = async function (ctx) {
    let rid=ctx.request.body.rid//这句很重要
    let uid1=ctx.request.body.uid1
    let uid2=ctx.request.body.uid2
   
   const result = await Request.update(
     {
       'state':1
     },
     {
       'where': { 'rid': rid}
     }
   )
   console.log(uid1+uid2)
   const result2 = await Friend.create({
    uid1: uid1,
    uid2: uid2,
    date: Sequelize.literal('CURRENT_TIMESTAMP'),
    
})
   console.log("sucess"+result2)
   //return result===1
   return result2 // 返回一个数组，更新成功的条目为1否则为0。由于只更新一个条目，所以只返回一个元素
 }
 //reject
const rejectRequest = async function (ctx) {
    let rid=ctx.request.body.rid//这句很重要
   
   const result = await Request.update(
     {
       'state':2//2代表拒绝
     },
     {
       'where': { 'rid': rid}
     }
   )
   console.log(result)
   //return result===1
   return result[0]=== 1 // 返回一个数组，更新成功的条目为1否则为0。由于只更新一个条目，所以只返回一个元素
 }
 //删除好友
 const delFriend = async function (ctx) {
    let fid=ctx.request.body.fid//这句很重要
   console.log(fid)
   const result = await Friend.destroy({
    where: {
        fid
      }
    }
   
   )
   console.log("成功删除")
   //return result===1
   return result[0]=== 1 // 返回一个数组，更新成功的条目为1否则为0。由于只更新一个条目，所以只返回一个元素
 }

// 获取所有未处理好友请求
const getAllRequests = async function (ctx) {
    const user = ctx.state.user;
    const requests = await Request.findAll({
        raw: true,
        where:{
            [Op.and]: [
                { uid2: user.id }, 
                { state: 0 },
            ],
        }
    });

    let res = requests;
    for(let i = 0; i < requests.length; i++) {
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
    getAllFriendsList
}