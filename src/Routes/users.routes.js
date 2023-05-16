const { Router } = require("express")
const UsersRoutes = Router()
const UsersController = require('../controllers/UsersController')

const userController = new UsersController()

UsersRoutes.post('/', userController.create)

module.exports = UsersRoutes