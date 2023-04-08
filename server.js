require('dotenv').config()

const { Application } = require('./src/app')
const mongoose = require('mongoose')

mongoose.connect(
  process.env.MONGO_URI || 'mongodb://localhost/activity-badge',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
  .then(() => {
    console.info('[MongoDB] Connected to database.')

    const app = new Application(
      process.env.NODE_ENV || 'development',
      process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 5000
    )

    app.start()
      .then(() => console.info(`[Listener] Listening on port ${app.port}.`))
      .catch((error) => console.error(`[Listener] Error: ${error.message}.`))
  })
  .catch((error) => console.error(`[MongoDB] Error: ${error.message}.`))
