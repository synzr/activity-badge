const path = require('path')

const express = require('express')
const { engine: handlebars } = require('express-handlebars')

const { npmDistMiddleware } = require('./middlewares/npm-dist')

class Application {
  constructor (environment = 'development', port = 5000, cache) {
    this.environment = environment
    this.port = port
    this.cache = cache

    this.expressApplication = this.#createExpressApplication()
  }

  start () {
    return new Promise((resolve, reject) => {
      return this.expressApplication
        .listen(this.port, () => resolve())
        .on('error', (error) => reject(error))
    })
  }

  #createExpressApplication () {
    const app = express()

    app.set('environment', this.environment)
    app.set('port', this.port)

    app.set('cache', this.cache)

    app.engine('handlebars', handlebars())

    app.set('view engine', 'handlebars')
    app.set('views', './views')

    app.get('/', (req, res) => res.render('index', { environment: this.environment }))

    app.use(
      '/node_modules/:package/dist/*',
      npmDistMiddleware([
        'htmx.org', 'bootstrap', 'handlebars'
      ])
    )
    app.use('/static', express.static(
      path.join(process.cwd(), 'static')
    ))

    return app
  }
}

module.exports = { Application }
