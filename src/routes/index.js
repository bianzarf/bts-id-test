const { Router } = require('express')

const routes = Router();


routes.use('/auth', require('./authRouter'))
routes.use('/todo', require('./todoRouter'))
routes.use('/todo-detail', require('./todoDetailRouter'))

module.exports = routes