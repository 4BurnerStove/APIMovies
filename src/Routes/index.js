const { Router } = require('express')

const usersRoutes = require('./users.routes')
const movieNotesRoutes = require('./notesMovie.routes')

const routes = Router()
routes.use('/users', usersRoutes)
routes.use('/movieNotes', movieNotesRoutes)

module.exports = routes