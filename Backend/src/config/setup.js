import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import * as AdminJSMongoose from '@adminjs/mongoose'
import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongodb-session'

import * as Models from '../models/index.js'
import { authenticate, COOKIE_PASSWORD } from './config.js'

AdminJS.registerAdapter(AdminJSMongoose)

const MongoDBStore = MongoStore(session)

export const admin = new AdminJS({
  resources: [
    {
      resource: Models.Customer,
      options: {
        listProperties: ['phone', 'role', 'isActivated'],
        filterProperties: ['phone', 'role'],
      },
    },
    {
      resource: Models.DeliveryPartner,
      options: {
        listProperties: ['phone', 'role', 'isActivated'],
        filterProperties: ['phone', 'role'],
      },
    },
    {
      resource: Models.Admin,
      options: {
        listProperties: ['phone', 'role', 'isActivated'],
        filterProperties: ['phone', 'role'],
      },
    },
    { resource: Models.Branch },
    { resource: Models.Product },
    { resource: Models.Category },
    { resource: Models.Order },
    { resource: Models.Counter },
  ],

  branding: {
    companyName: 'Grocery Delivery App',
    withMadeWithLove: false,
  },

  rootPath: '/admin',
})

export const buildAdminRouter = async () => {
  const app = express()

  const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'adminSessions',
  })

  app.use(
    session({
      secret: COOKIE_PASSWORD,
      resave: false,
      saveUninitialized: false,
      store,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    })
  )

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookiePassword: COOKIE_PASSWORD,
    }
  )

  app.use(admin.options.rootPath, adminRouter)

  return app
}
