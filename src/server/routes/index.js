var router = require('koa-router')();

router.get('/', async (ctx)=>{
  ctx.body='首页';
});

router.get('/admin', async (ctx)=>{
  ctx.body='管理';
});

// 将该router暴露出去
module.exports = router;
