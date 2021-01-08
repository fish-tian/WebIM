var passport = require('koa-passport');
var LocalStrategy = require('passport-local').Strategy;
// 不使用service层
var Sequelize = require('sequelize');
var WebIm = require('./db.js');
var User = require('../models/user.js')(WebIm, Sequelize);
var bcrypt = require('bcryptjs');

// 序列化
passport.serializeUser(
    (user, done) => {
        console.log("serializeUser---------------------------");
        done(null, user.id)
    }
);

// 反序列化
passport.deserializeUser(
    (id, done) => {
        console.log("deserializeUser---------------------------");
        User.findByPk(id).then((user) => {
            if (user) {
                // 可以不使用 user.get() ，直接 user
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    }
);

// 本地策略
// 注册
passport.use('local-signup', new LocalStrategy(
    // options 允许 passport 使用 req
    { passReqToCallback: true },
    (req, username, password, done) => {
        console.log('passport local-signup-----------------');
        // console.log(username);
        // console.log(password);
        User.findOne({
            where: {
                user_name: username
            }
        }).then((user) => {
            if (user) {
                // 用户名已存在
                return done(null, false, {
                    message: 'Username is already taken'
                });
            } else {
                let userPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
                console.log(username);
                console.log(userPassword);
                let data = {
                    user_name: username,
                    password: userPassword,
                    email: req.body.email
                };
                User.create(data).then((newUser, created) => {
                    if (!newUser) {
                        // 创建新用户失败
                        return done(null, false);
                    } else {
                        // 创建新用户成功
                        return done(null, newUser);
                    }
                });
            }
        });

    }));

// 登录
passport.use('local-signin', new LocalStrategy((username, password, done) => {
    console.log('passport local-signin-----------------');
    var isValidPassword = function (userpass, psword) {
        return bcrypt.compareSync(psword, userpass);
    };

    User.findOne({
        where: {
            user_name: username
        }
    })
        .then((user) => {
            // 用户不存在
            if (!user) {
                return done(null, false, {
                    message: 'Username does not exist'
                });
            }
            // 密码不匹配
            if (!isValidPassword(user.password, password)) {
                return done(null, false, {
                    message: 'Incorrect password'
                });
            }
            // 登录成功
            return done(null, user.get());
        })
        .catch((err) => {
            console.log("Error:", err);

            return done(null, false, {
                message: 'Something wrong with Signin'
            });
        });
}));