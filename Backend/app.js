import 'dotenv/config'
import fastify from 'fastify'
import fastifySocketIO from 'fastify-socket.io'
import fastifyFormbody from 'fastify-formbody'

import { connectDB } from './src/config/connect.js'
import { PORT } from './src/config/config.js'
import { registerRoutes } from './src/routes/index.js'
import { buildAdminRouter, admin } from './src/config/setup.js'

const app = fastify({ logger: true })

const start = async () => {
  try {
    // 1️⃣ DB
    await connectDB(process.env.MONGO_URI)
    console.log('DB Connected')

    // 2️⃣ Body parser (Fastify v3)
    app.register(fastifyFormbody)

    // 3️⃣ Socket.IO
    app.register(fastifySocketIO, {
      cors: { origin: '*' },
      pingInterval: 10000,
      pingTimeout: 5000,
      transports: ['websocket'],
    })

    // 4️⃣ API routes
    await registerRoutes(app)

    // 5️⃣ Start FASTIFY server (API)
    await app.listen(PORT, '0.0.0.0')
    console.log(`🚀 API running at http://localhost:${PORT}`)

    // 6️⃣ Socket events
    app.ready(() => {
      app.io.on('connection', (socket) => {
        console.log('User connected')

        socket.on('joinRoom', (orderId) => {
          socket.join(orderId)
          console.log(`User joined room ${orderId}`)
        })

        socket.on('disconnect', () => {
          console.log('User disconnected')
        })
      })
    })

    // 7️⃣ START ADMINJS (EXPRESS – SEPARATE SERVER)
    const adminApp = await buildAdminRouter()
    adminApp.listen(3001, () => {
      console.log(
        `🛠️ AdminJS running at http://localhost:3001${admin.options.rootPath}`
      )
    })
  } catch (err) {
    console.error('❌ Server start failed:', err)
    process.exit(1)
  }
}

start()
