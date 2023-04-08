require('dotenv').config()

const { Application } = require('./src/app')

const mongoose = require('mongoose')

const cacheManager = require('cache-manager')
const { redisStore } = require('cache-manager-redis-yet')

mongoose.connect(
  process.env.MONGO_URI || 'mongodb://localhost/activity-badge',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
  .then(async () => {
    console.info('[mongoose] Connected to MongoDB database.')

    const cache = cacheManager.caching(
      {
        store: await redisStore(
          {
            url: process.env.REDIS_URL || 'redis://localhost:6379'
          }
        )
      }
    )
    console.info('[cache manager] Connected to Redis.')

    const app = new Application(
      process.env.NODE_ENV || 'development',
      process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 5000,
      cache
    )

    app.start()
      .then(() => console.info(`[listener] Listening on port ${app.port}.`))
      .catch((error) => console.error(`[listener] Error: ${error.message}.`))
  })
  .catch((error) => console.error(`[server] Error: ${error.message}.`))
