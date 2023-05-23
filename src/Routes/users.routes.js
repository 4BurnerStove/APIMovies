const { Router } = require("express")
const UsersRoutes = Router()
const UsersController = require('../controllers/UsersController')

const userController = new UsersController()

UsersRoutes.post('/', userController.create)
UsersRoutes.put('/:id', userController.update)

module.exports = UsersRoutes