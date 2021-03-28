const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('group_member', {
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    unread_cnt: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'group_member',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "uid" },
          { name: "sid" },
        ]
      },
    ]
  });
};
