import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'

import hotSearch from './interface/hotSearch'
import search from './interface/search'

async function start () {
  const app = new Koa()
  const host = process.env.HOST || 'localhost'
  const port = process.env.PORT || 3000

  // Import and Set Nuxt.js options
  const config = require('../nuxt.config.js')
  config.dev = !(app.env === 'production')

  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  app.use(hotSearch.routes()).use(hotSearch.allowedMethods())
  app.use(search.routes()).use(search.allowedMethods())
  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false // Mark request as handled for Koa
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
}

start()
