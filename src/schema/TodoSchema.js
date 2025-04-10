const { Joi } = require('celebrate')

const searchSchema = Joi.object().keys({
    todo_name: Joi.string().max(200).optional(),
}).unknown(true)

const insertSchema = Joi.object().keys({
    todo_name : Joi.string().max(200).required(),
}).unknown(true)
const updateSchema = Joi.object().keys({
    todo_id : Joi.string().max(50).required(),
    todo_name : Joi.string().max(200).required(),
}).unknown(true)
const deleteItemSchema = Joi.object()
  .keys({
    todo_id: Joi.string().max(50).required(),
  })
  .unknown(true);
const statusItemSchema = Joi.object()
  .keys({
    todo_id: Joi.string().max(50).required(),
    status: Joi.boolean().required(),
  })
  .unknown(true);

const deleteSchema = Joi.array().items(deleteItemSchema).min(1).required()




module.exports = { 
    searchSchema,
    insertSchema,
    updateSchema,
    deleteItemSchema,
    deleteSchema,
    statusItemSchema
    
}