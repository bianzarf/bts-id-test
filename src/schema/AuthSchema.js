const { Joi } = require('celebrate')

const loginSchema = Joi.object().keys({
    username: Joi.string().max(20).required(),
    password: Joi.string().min(4).required(),
}).unknown(true)

const registerSchema = Joi.object().keys({
    username : Joi.string().max(25).required(),
    password : Joi.string().max(50).required(),
    name : Joi.string().max(100).required(),
    email : Joi.string().max(50).required(),
}).unknown(true)




module.exports = { 
    loginSchema,
    registerSchema
}