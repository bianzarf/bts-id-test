const { getOneTodo, insertTodo, updateTodo, deleteTodo } = require("../model/Todo")
const { search, insertTodoDetail, getOneTodoDetail, updateTodoDetail, deleteTodoDetail } = require("../model/TodoDetail")
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

    async doInsert(req, res){
        const param = req.body
        try {

            const todoOjb = getOneTodo(param)
            if(!todoOjb){
                BadRequest(res, `Todo ${param.todo_id} is not exist`)
                return
            }

            param.todo_detail_id = StringUtil.getUUID()
            param.created_by = req.user.username
            param.status = false
            insertTodoDetail(param)

            Ok(res, "Insert Success")


        } catch (error) {
            console.error("TodoController.doInsert", error)
            InternalServerErr(res, "Error during insert")
        }
    }

    async doUpdate(req, res){
        const param = req.body
        try {
            let todoDetailObj = getOneTodoDetail({todo_detail_id : param.todo_detail_id})
            if(!todoDetailObj){
                BadRequest(res, "Data not found")
                return
            }

            todoDetailObj.todo_detail_name = param.todo_detail_name

            updateTodoDetail(todoDetailObj)

            Ok(res, "Update Success")


        } catch (error) {
            console.error("TodoController.doUpdate", error)
            InternalServerErr(res, "Error during update")
        }
    }

    async doUpdateStatus(req, res){
        const param = req.body
        try {
            let todoDEtailObj = getOneTodoDetail({todo_detail_id : param.todo_detail_id})
            if(!todoDEtailObj){
                BadRequest(res, "Data not found")
                return
            }

            todoDEtailObj.status = param.status

            updateTodo(todoDEtailObj)

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
                let todoDetailObj = getOneTodoDetail({todo_detail_id : param.todo_detail_id})
                if(todoDetailObj)
                    deleteTodoDetail(todoDetailObj)
            }

            Ok(res, "Delete Success")


        } catch (error) {
            console.error("TodoController.doMultipleDelete", error)
            InternalServerErr(res, "Error during Delete")
        }
    }
}

module.exports = new TodoController()
