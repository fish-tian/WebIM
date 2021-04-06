# webim

## 项目安装
```
npm install
```

## 项目开发：编译和热部署
```
在根目录下复制.env.example，粘贴为.env，修改其中数据库的账号和密码

npm run serve        // 启动vue
node .\server\app.js // 启动node

// 访问 http://localhost:8080/#/ 
```

## 项目结构介绍
```
- public            静态资源文件夹

- server            服务器文件夹
    - config        Sequelize 数据库实例文件夹、koa-passport配置文件        
    - controllers   Controller 文件夹
    - models        数据库模型文件夹
    - routes        路由文件夹
    - sql           sql文件文件夹
      app.js        
      socket.js     Socket.IO 配置文件

- src               前端文件夹
    - assets        静态资源文件夹
    - components    组件文件夹
    - plugins       插件文件夹
    - router        路由文件夹
    - store         vuex 文件夹
    - views         页面文件夹
      App.vue
      main.js
      store.js      用于数据存储

  .env              存储一些配置
  vue.config.js     vue的配置，目前用来处理跨域请求
  ...
```

## 目前进展介绍
目前，前后端完成了登录、注册、好友、单聊模块；
