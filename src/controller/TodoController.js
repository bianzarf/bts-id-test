const { search, getOneTodo, insertTodo, updateTodo, deleteTodo } = require("../model/Todo")
const { getTodoDetailByTodo } = require("../model/TodoDetail")
const { BadRequest, Ok, InternalServerErr, Unauthorized, SearchOk } = require("../util/ResponseUtil")
const StringUtil = require("../util/StringUtil")

class TodoController {
    async doSearch(req, res) {
        const param = req.query
        try {
            const { page, perPage, totalPages, totalRows, result } = search(param)

            SearchOk(res, page, perPage, totalRows, totalPages, result)

        } catch (error) {
            console.error("TodoController.doSearch", error)
            InternalServerErr(res, "Error during searching data")
        }

    }

    async doGetDetail(req, res){
        const param = req.params
        try {
            let todoObj = getOneTodo(param)
            if(!todoObj){
                BadRequest(res, "Data not found")
                return
            }

            todoObj.detail = getTodoDetailByTodo({todo_id : param.todo_id})

            Ok(res, "Data Found", todoObj)


        } catch (error) {
            console.error("TodoController.doGetDetail", error)
            InternalServerErr(res, "Error during get detail")
        }
    }

    async doInsert(req, res){
        const param = req.body
        try {

            param.todo_id = StringUtil.getUUID()
            param.created_by = req.user.username
            param.status = false
            insertTodo(param)

            Ok(res, "Insert Success")


        } catch (error) {
            console.error("TodoController.doInsert", error)
            InternalServerErr(res, "Error during insert")
        }
    }

    async doUpdate(req, res){
        const param = req.body
        try {
            let todoObj = getOneTodo({todo_id : param.todo_id})
            if(!todoObj){
                BadRequest(res, "Data not found")
                return
            }

            todoObj.todo_name = param.todo_name

            updateTodo(todoObj)

            Ok(res, "Update Success")


        } catch (error) {
            console.error("TodoController.doUpdate", error)
            InternalServerErr(res, "Error during update")
        }
    }

    async doUpdateStatus(req, res){
        const param = req.body
        try {
            let todoObj = getOneTodo({todo_id : param.todo_id})
            if(!todoObj){
                BadRequest(res, "Data not found")
                return
            }

            todoObj.status = param.status

            updateTodo(todoObj)

            Ok(res, "Update Success")


        } catch (error) {
            console.error("TodoController.doUpdateStatus", error)
            InternalServerErr(res, "Error during update")
        }
    }

    async doMultipleDelete(req, res){
        let params = req.body
        try {
            for (let i = 0; i < params.length; i++) {
                let param = params[i]
                let todoObj = getOneTodo({todo_id : param.todo_id})
                if(todoObj)
                    deleteTodo(todoObj)
            }

            Ok(res, "Delete Success")


        } catch (error) {
            console.error("TodoController.doMultipleDelete", error)
            InternalServerErr(res, "Error during Delete")
        }
    }
}

module.exports = new TodoController()
