// import db from '../config/db.js' // 引入user的表结构
//var WebIm = require('../config/db.js');
//var User = WebIm.import('../models/user.js');
// const userModel = '../schema/user.js'
// const WebIMDb = db.WebIM; // 引入数据库
// var User = WebIMDb.require('../schema/user.js');
var bcrypt = require('bcryptjs');
// import bcrypt from 'bcryptjs'  // 引入加密

// const User = WebIMDb.import(userModel) // 用sequelize的import方法引入表结构，实例化了User。

var Sequelize = require('sequelize');
var WebIm = require('../config/db.js');
var User = require('../models/user.js')(WebIm, Sequelize);

const getUserById = async function (id) { // 注意是async function 而不是function。对于需要等待promise结果的函数都需要async await。
  const userInfo = await User.findOne({ // 用await控制异步操作，将返回的Promise对象里的数据返回出来。也就实现了“同步”的写法获取异步IO操作的数据
    where: {
      id: id
    }
  })

  return userInfo // 返回数据
}

const getUserByName = async function (username) {
  const userInfo = await User.findOne({
    where: {
      user_name: username
    }
  })

  return userInfo
}

const insertNewEntry = async function(data) {
  const password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10))
  await User.create({
    user_name: data.username,
    email:data.email,
    password: password
  })
  return true
}

module.exports = {
  getUserById, // 导出getUserById的方法，将会在controller里调用
  getUserByName,
  insertNewEntry
}
