const app = new(require('koa'))()
  , koa = require('koa-router')()
  , json = require('koa-json')
  , logger = require('koa-logger')
  , auth = require('./server/routes/auth.js') // 引入auth
  , api = require('./server/routes/api.js')
  , jwt = require('koa-jwt')
  , path = require('path')
  , serve = require('koa-static')
  , historyApiFallback = require('koa-history-api-fallback');


app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());


app.use(function* (next){
  let start = new Date;
  yield next;
  let ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(async function(ctx, next) {
  try {
    await next();
  }catch (err) {
    if(401 == err.status) {
      ctx.status =  401;
      ctx.body = {
        success: false,
        token: null,
        info: 'Protected resource, use Authorization header to get access'
      }
    }else {
      throw err;
    }
  }
})

app.on('error', function(err, ctx){
  console.log('server error', err);
});
app.listen(8889,() => {
  console.log('Koa is listening in 8889');
});


koa.use('/auth', auth.routes()) // 挂载到koa-router上，同时会让所有的auth的请求路径前面加上'/auth'的请求路径。
koa.use('/api', jwt({secret: 'vue-koa-demo'}), api.routes()) // 所有走/api/打头的请求都需要经过jwt验证。

app.use(koa.routes()); // 将路由规则挂载到Koa上。

app.use(historyApiFallback());
// 静态文件serve在koa-router的其他规则之上
app.use(serve(path.resolve('dist'))); // 将webpack打包好的项目目录作为Koa静态文件服务的目录


module.exports = app;
