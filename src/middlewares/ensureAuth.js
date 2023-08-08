const { verify } = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const authConfig = require('../configs/auth')

function ensureAuth(req, res, next){
  const authHeader = req.header.autorization

  if(!authHeader){
    throw new AppError('JWT token invalido', 401)
  }

  const [, token] = authHeader.split(' ')

  try {
    const {sub: user_id} = verify(token, authConfig.jwt.secret)
    req.user = {
      id: Number(user_id)
    }

    return next()
  } catch {
    throw new AppError("JWT token invalido", 401)
  }
}

module.exports = ensureAuth