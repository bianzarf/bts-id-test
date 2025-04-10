const express = require('express')
const router = express.Router()

const ctrl = require('../controller/AuthController')
const { celebrate } = require('celebrate')
const { registerSchema, loginSchema } = require('../schema/AuthSchema')


router.post("/login", celebrate({body: loginSchema}), ctrl.login)
router.post("/register", celebrate({body: registerSchema}), ctrl.register)

module.exports = router

