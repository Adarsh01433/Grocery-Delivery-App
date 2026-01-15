import 'dotenv/config'
import fastify from 'fastify'
import fastifySocketIO from 'fastify-socket.io'
import fastifyFormbody from 'fastify-formbody'
import cors from 'fastify-cors'


import { connectDB } from './src/config/connect.js'
import { registerRoutes } from './src/routes/index.js'
import { buildAdminRouter, admin } from './src/config/setup.js'

// 🔹 PORTS (IMPORTANT)
const API_PORT = 3001      // 🔥 Mobile / Customer API
const ADMIN_PORT = 3000   // 🔥 Admin Panel (AdminJS)

// 🔹 FASTIFY APP (API SERVER)
const app = fastify({ logger: true })

const start = async () => {
  try {
    // 1️⃣ DATABASE
    await connectDB(process.env.MONGO_URI)
    console.log('✅ DB Connected')

    // 2️⃣ CORS
    await app.register(cors, {
      origin: true,
    })

    // 3️⃣ BODY PARSER
    app.register(fastifyFormbody)

    // 4️⃣ SOCKET.IO
    app.register(fastifySocketIO, {
      cors: { origin: '*' },
      pingInterval: 10000,
      pingTimeout: 5000,
      transports: ['websocket'],
    })

    // 5️⃣ REGISTER ALL API ROUTES (/api/*)
    await registerRoutes(app)

    // 🔥 DEBUG: PRINT ROUTES (OPTIONAL BUT USEFUL)
    app.ready(() => {
      console.log(app.printRoutes())
    })

    // 6️⃣ START FASTIFY API SERVER
    await app.listen(API_PORT, '0.0.0.0')
    console.log(`🚀 API running at http://localhost:${API_PORT}`)

    // 7️⃣ SOCKET EVENTS
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

    // 8️⃣ START ADMINJS (SEPARATE EXPRESS SERVER)
    const adminApp = await buildAdminRouter()
    adminApp.listen(ADMIN_PORT, () => {
      console.log(
        `🛠️ AdminJS running at http://localhost:${ADMIN_PORT}${admin.options.rootPath}`
      )
    })

  } catch (err) {
    console.error('❌ Server start failed:', err)
    process.exit(1)
  }
}

start()
