const express = require('express')

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

    app.get('/', (req, res) => res.send('Hello world!'))

    return app
  }
}

module.exports = { Application }
