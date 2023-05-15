const { Router } = require('express')

const UsersRoutes = require('./users.routes')

const routes = Router()
routes.use('/users', UsersRoutes)

module.exports = routes