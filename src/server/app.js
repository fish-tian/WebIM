var Koa = require('koa');
    
// 引入路由模块
var index = require('./routes/index');
var users = require('./routes/users');

var app = new Koa();

// 路由
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.listen(3000);