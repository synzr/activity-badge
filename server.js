require('dotenv').config()

const { Application } = require('./src/app')

const app = new Application(
  process.env.NODE_ENV || 'development',
  process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 5000
)

app.start()
  .then(() => console.info(`[Listener] Listening on port ${app.port}`))
  .catch((error) => console.error(`[Listener] Error: ${error.message}`))
