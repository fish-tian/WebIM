// import user from '../models/user.js'
// import jwt from 'jsonwebtoken'
// import bcrypt from 'bcryptjs'
var UserService = require('../services/UserService.js');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

// 获取用户信息
const getUserInfo = async function (ctx) {
  const id = ctx.params.id // 获取url里传过来的参数里的id
  const result = await UserService.getUserById(id) // 通过await “同步”地返回查询结果
  ctx.body = result // 将请求的结果放到response的body里返回
}

// 通过用户名获取用户信息
const getUserInfoName = async function (ctx) {
  const data = ctx.request.body
  const name = data.username
  const result = await UserService.getUserByName(name) // 通过await “同步”地返回查询结果
  if (result != null) {
    ctx.body = {
      success: true,
      info: "用户名已经存在"
    }
  }
  else {
    ctx.body = {
      success: false,
      info: "该用户名可以注册"
    }
  }
}

// 登录
const postUserAuth = async function (ctx) {
  const data = ctx.request.body; // post过来的数据存在request.body里
  //console.log(data);
  const userInfo = await UserService.getUserByName(data.username)
  if (userInfo != null) { // 如果查无此用户会返回null
    if (!bcrypt.compareSync(data.password, userInfo.password)) {
      ctx.body = {
        success: false, // success标志位是方便前端判断返回是正确与否
        info: '密码错误！'
      }
    } else {
      const userToken = {
        name: userInfo.user_name,
        id: userInfo.id
      }
      const secret = 'vue-koa-demo' // 指定密钥
      const token = jwt.sign(userToken, secret) // 签发token
      ctx.body = {
        success: true,
        token: token // 
      }
    }
  } else {
    ctx.body = {
      success: false,
      info: '用户不存在！' // 如果用户不存在返回用户不存在
    }
  }
}

// const getUserByName = async function (ctx) {
//   const data = ctx.request.body
//   const userInfo = await user.getUserByName(data.name)
//   if (userInfo != null) {
//     ctx.body = {
//       success: true, // success标志位是方便前端判断返回是正确与否
//       info: '用户名已经存在!'
//     }
//   }
//   else {
//     ctx.body = {
//       success: false, // success标志位是方便前端判断返回是正确与否
//       info: '用户名不存在, 可以注册'
//     }
//   }
// }


// const insertUser = async function(ctx) {
//   const data = ctx.request.body
//   const succeed = await user.insertNewEntry(data.name, data.password);
//   if (succeed) {
//     ctx.body = {
//       success: true,
//       info: "注册成功"
//     }
//   }
//   else {
//     ctx.body = {
//       success: false,
//       info: "注册插入失败"
//     }
//   }
// }


// 注册
const register = async function(ctx) {
  const data = ctx.request.body
  const name = data.username
  // 检查用户名是否重复
  const result = await UserService.getUserByName(name) // 通过await “同步”地返回查询结果
  if (result != null) {
    ctx.body = {
      success: false,
      info: "用户名已经存在"
    }
  }
  else {
    const res = await UserService.insertNewEntry(data)
    ctx.body = {
      success: true,
      info:"注册成功"
    }
  }
}

module.exports = {
  getUserInfo,
  postUserAuth,
  getUserInfoName,
  register
}
