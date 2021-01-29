var DataTypes = require("sequelize").DataTypes;
var _request = require("./request");
var _friend = require("./friend");
var _user = require("./user");

function initModels(sequelize) {
  var request = _request(sequelize, DataTypes);
  var friend = _friend(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  return {
    request,
    friend,
    user
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
