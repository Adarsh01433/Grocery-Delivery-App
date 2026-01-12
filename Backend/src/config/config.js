import "dotenv/config"
import fastifySession from "@fastify/session"
import ConnectMongoDBSession from "connect-mongodb-session"
import { Admin } from "../models/index.js"

export const PORT = process.env.PORT || 3000
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD

const MongoDbStore = ConnectMongoDBSession(fastifySession)

export const sessionStore = new MongoDbStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
})

sessionStore.on("error", (error) => {
  console.log("Session store error", error)
})

// ✅ FIXED AUTHENTICATE FUNCTION
export const authenticate = async (email, password) => {
  if (!email || !password) return null

  // TEMP HARDCODED LOGIN
  if (
    email === "forpublicbrowsing@gmail.com" &&
    password === "12345678"
  ) {
    return { email }
  }

  return null
}
