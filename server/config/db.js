require('dotenv').config()
var Sequelize = require('sequelize');
const WebIM = new Sequelize(`mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL || 'localhost'}/webim`, {
  logging: false,
  define: {
    timestamps: false // 取消Sequelzie自动给数据表加入时间戳（createdAt以及updatedAt）
  }
})

module.exports = WebIM; // 将Sequelize实例暴露出去