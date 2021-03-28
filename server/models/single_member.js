const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('single_member', {
    uid1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uid2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unread_cnt: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'single_member',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "uid1" },
          { name: "uid2" },
        ]
      },
    ]
  });
};
