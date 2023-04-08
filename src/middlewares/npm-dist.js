const fs = require('fs')
const path = require('path')
const process = require('process')

const npmDistMiddleware = (allowedPackages) => {
  return (req, res, next) => {
    if (
      !Object.hasOwn(req.params, 'package') ||
      !allowedPackages.includes(req.params.package) ||
      !['GET', 'HEAD'].includes(req.method)
    ) {
      return res.sendStatus(400)
    }

    const filename = req
      .originalUrl
      .split('/dist')[1]
      .split('?')[0]
      .split('&')[0]
    const filepath = path.join(
      process.cwd(), 'node_modules', req.params.package, 'dist', filename
    )

    if (!fs.existsSync(filepath)) {
      return res.sendStatus(404)
    }

    res.sendFile(filepath)
  }
}

module.exports = { npmDistMiddleware }
