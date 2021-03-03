var DataTypes = require("sequelize").DataTypes;
var _member = require("./member");
var _friend = require("./friend");
var _group = require("./group");
var _message = require("./message");
var _request = require("./request");
var _session = require("./session");
var _user = require("./user");

function initModels(sequelize) {
  var member = _member(sequelize, DataTypes);
  var friend = _friend(sequelize, DataTypes);
  var group = _group(sequelize, DataTypes);
  var message = _message(sequelize, DataTypes);
  var request = _request(sequelize, DataTypes);
  var session = _session(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  
  return {
    member,
    friend,
    group,
    message,
    request,
    session,
    user
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
