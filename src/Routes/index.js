const { Router } = require('express')

const usersRoutes = require('./users.routes')
const movieNotesRoutes = require('./notesMovie.routes')
const sessionsRouter = require('./sessions.routes')

const routes = Router()
routes.use('/users', usersRoutes)
routes.use('/movieNotes', movieNotesRoutes)
routes.use('/sessions', sessionsRouter)

module.exports = routes