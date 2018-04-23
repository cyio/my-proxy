const Koa = require('koa')
const axios = require('axios')
const app = new Koa()

const Router = require('koa-router')

let home = new Router()

// 子路由1
home.get('/', async ctx => {
  let html = `
		<ul>
			<li><a href="/page/helloworld">/page/helloworld</a></li>
			<li><a href="/page/404">/page/404</a></li>
		</ul>
	`
  ctx.body = html
})

// 子路由2
let page = new Router()
page
  .get('/404', async ctx => {
    ctx.body = '404 page!'
  })
  .get('/helloworld', async ctx => {
    ctx.body = 'helloworld page!'
  })

let proxy = new Router()
proxy.get('/', async (ctx, next) => {
  if (!ctx.query.url) return
  ctx.body = await axios.get(ctx.query.url).then(res => res.data)
})

// 装载所有子路由
let router = new Router()
router.use('/', home.routes(), home.allowedMethods())
router.use('/page', page.routes(), page.allowedMethods())
router.use('/proxy', proxy.routes(), proxy.allowedMethods())

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())

const port = 8099
app.listen(port, () => {
  console.log(`[demo] route-use-middleware is starting at port ${port}`)
})
