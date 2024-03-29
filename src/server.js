require("express-async-errors")
require('dotenv/config')


const express = require('express')
const database = require("./database/sqlite")
const AppError = require('./utils/AppError')
const routes = require('./Routes/index')
const cors = require('cors')
const uploadConfig = require('./configs/upload')

const app = express()

app.use(express.json())

app.use(cors())

app.use(routes)

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

database()
app.use((error, req, res, next) => {
  if(error instanceof AppError){
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }

  console.error(error);

  return res.status(500).json({
    status: "error",
    message: "Internal server error"
  });

})

const PORT = process.env.SERVER_PORT || 4000 ;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))