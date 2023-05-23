const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')
const {hash}= require('bcryptjs')

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body

    const database = await sqliteConnection()
    const checkUserEmailExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if(checkUserEmailExists){
      throw new AppError("Este e-mail já está em uso.")
    }

    if(!name){
      throw new AppError("Nome é obrigatório!")
    }

    const hashedPassword = await hash(password, 8)

    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword])

    res.status(201).json()
  }
}

module.exports = UsersController