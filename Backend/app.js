import 'dotenv/config'
import fastify from 'fastify'
import fastifySocketIO from 'fastify-socket.io'
import fastifyFormbody from 'fastify-formbody'
import cors from 'fastify-cors'

import { connectDB } from './src/config/connect.js'
import { registerRoutes } from './src/routes/index.js'
import { buildAdminRouter, admin } from './src/config/setup.js'

// 🔹 PORTS
const API_PORT = 3001      // Mobile / Customer API
const ADMIN_PORT = 3000   // AdminJS

// 🔹 FASTIFY INSTANCE
const app = fastify({ logger: true })

const start = async () => {
  try {
    // 1️⃣ CONNECT DATABASE (BLOCKING)
    await connectDB(process.env.MONGO_URI)
    // ⚠️ yahan koi console.log nahi — DB ka log connectDB karega

    // 2️⃣ CORS
    await app.register(cors, {
      origin: true,
    })

    // 3️⃣ BODY PARSER
    await app.register(fastifyFormbody)

    // 4️⃣ SOCKET.IO
    await app.register(fastifySocketIO, {
      cors: { origin: '*' },
      pingInterval: 10000,
      pingTimeout: 5000,
      transports: ['websocket'],
    })

    // 5️⃣ REGISTER ROUTES
    await registerRoutes(app)

    // 6️⃣ PRINT ROUTES (DEBUG)
    app.ready(() => {
      console.log(app.printRoutes())
    })

    // 7️⃣ START API SERVER
    await app.listen(API_PORT, '0.0.0.0')
    console.log(`🚀 API running at http://localhost:${API_PORT}`)

    // 8️⃣ SOCKET EVENTS
    app.io.on('connection', (socket) => {
      console.log('🔌 Socket connected')

      socket.on('joinRoom', (orderId) => {
        socket.join(orderId)
        console.log(`👥 Joined room ${orderId}`)
      })

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected')
      })
    })

    // 9️⃣ START ADMINJS (SEPARATE SERVER)
    const adminApp = await buildAdminRouter()
    adminApp.listen(ADMIN_PORT, () => {
      console.log(
        `🛠️ AdminJS running at http://localhost:${ADMIN_PORT}${admin.options.rootPath}`
      )
    })

  } catch (err) {
    console.error('❌ Server failed to start')
    console.error(err)
    process.exit(1)
  }
}

start()
