const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')
const { hash }= require('bcryptjs')

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

  async update(req, res){
    const { name,  email } = req.body
    const { id } = req.params

    const database = await sqliteConnection()
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

    if (!user) {
      throw new AppError('Usuário não encontrado.')
    }

    const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id){
      throw new AppError('Este e-mail já esta em uso.')
    }


    user.name = name
    user.email = email

    
    await database.run(`UPDATE users SET
    name = ?,
    email= ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`, 
    [user.name, user.email, user.password, id])

    res.status(200).json()
  }
}

module.exports = UsersController