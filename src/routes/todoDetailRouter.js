const express = require('express')
const router = express.Router()

const ctrl = require('../controller/TodoDetailController')
const { celebrate } = require('celebrate')
const { 
    searchSchema,
    insertSchema,
    updateSchema,
    deleteItemSchema,
    deleteSchema, 
    statusItemSchema
} = require('../schema/TodoDetailSchema')

const { JwtFilter } = require('../middleware/RequestFilter');

router.route('/')
    .get(JwtFilter, celebrate({query: searchSchema}), ctrl.doSearch)
    .post(JwtFilter, celebrate({body: insertSchema}), ctrl.doInsert)
    .put(JwtFilter, celebrate({body: updateSchema}), ctrl.doUpdate)
    .delete(JwtFilter, celebrate({body: deleteSchema}), ctrl.doMultipleDelete)


router.put("/status", JwtFilter, celebrate({body: statusItemSchema}), ctrl.doUpdateStatus)


module.exports = router

