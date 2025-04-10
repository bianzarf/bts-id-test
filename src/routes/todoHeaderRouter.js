const express = require('express')
const router = express.Router()

const ctrl = require('../controller/TodoHeaderController')
const { celebrate } = require('celebrate')
const { 
    searchSchema,
    insertSchema,
    updateSchema,
    deleteItemSchema,
    deleteSchema, 
    statusItemSchema
} = require('../schema/TodoHeaderSchema')

const { JwtFilter } = require('../middleware/RequestFilter');
// router.all('/*', JwtFilter)

router.route('/')
    .get(JwtFilter, celebrate({query: searchSchema}), ctrl.doSearch)
    .post(JwtFilter, celebrate({body: insertSchema}), ctrl.doInsert)
    .put(JwtFilter, celebrate({body: updateSchema}), ctrl.doUpdate)
    .delete(JwtFilter, celebrate({body: deleteSchema}), ctrl.doMultipleDelete)

router.get('/one/:todo_header_id', JwtFilter, celebrate({params: deleteItemSchema}), ctrl.doGetDetail)
router.put('/status', JwtFilter, celebrate({body: statusItemSchema}), ctrl.doUpdateStatus)

module.exports = router

