const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')
const { hash, compare }= require('bcryptjs')

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
    const { name,  email, old_password, password } = req.body
    const  user_id  = req.user.id

    const database = await sqliteConnection()
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id])

    if (!user) {
      throw new AppError('Usuário não encontrado.')
    }

    const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id){
      throw new AppError('Este e-mail já esta em uso.')
    }


    user.name = name ?? user.name
    user.email = email ?? user.email

    if(password && !old_password){
      throw new AppError('Você precisa informar a senha antiga para definir a nova senha')
    }

    if (password && old_password){
      const CheckOldPassword = await compare(old_password, user.password)

      if(!CheckOldPassword) {
        throw new AppError("A senha antiga não confere")
      }

      user.password = await hash(password, 8)
    }


    await database.run(`UPDATE users SET
    name = ?,
    email= ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`, 
    [user.name, user.email, user.password, user_id])

    res.status(200).json()
  }
}

module.exports = UsersController