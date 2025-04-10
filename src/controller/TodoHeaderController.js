const { search, getOneTodoHeader, insertTodoHeader, updateTodoHeader, deleteTodoHeader } = require("../model/TodoHeader")
const { getTodoDetailByTodo, updateTodoDetail } = require("../model/TodoDetail")
const { BadRequest, Ok, InternalServerErr, Unauthorized, SearchOk } = require("../util/ResponseUtil")
const StringUtil = require("../util/StringUtil")
const { getTodoByTodoHeader, updateTodo } = require("../model/Todo")

class TodoController {
    async doSearch(req, res) {
        const param = req.query
        try {
            const { page, perPage, totalPages, totalRows, result } = search(param)

            for(let r of result){
                r.todos = getTodoByTodoHeader({todo_header_id : r.todo_header_id})
                for(let todo of r.todos){
                    todo.detail = getTodoDetailByTodo(todo)
                }
            }

            SearchOk(res, page, perPage, totalRows, totalPages, result)

        } catch (error) {
            console.error("TodoController.doSearch", error)
            InternalServerErr(res, "Error during searching data")
        }

    }

    async doGetDetail(req, res){
        const param = req.params
        try {
            let todoHeaderObj = getOneTodoHeader(param)
            if(!todoHeaderObj){
                BadRequest(res, "Data not found")
                return
            }

            let result = {...todoHeaderObj}

            result.todos = getTodoByTodoHeader({todo_header_id : param.todo_header_id})
            for(let todo of result.todos){
                todo.detail = getTodoDetailByTodo(todo)
            }

            Ok(res, "Data Found", result)


        } catch (error) {
            console.error("TodoController.doGetDetail", error)
            InternalServerErr(res, "Error during get detail")
        }
    }

    async doInsert(req, res){
        const param = req.body
        try {

            param.todo_header_id = StringUtil.getUUID()
            param.created_by = req.user.username
            param.status = false
            insertTodoHeader(param)

            Ok(res, "Insert Success")


        } catch (error) {
            console.error("TodoController.doInsert", error)
            InternalServerErr(res, "Error during insert")
        }
    }

    async doUpdate(req, res){
        const param = req.body
        try {
            let todoHeaderObj = getOneTodoHeader({todo_header_id : param.todo_header_id})
            if(!todoHeaderObj){
                BadRequest(res, "Data not found")
                return
            }

            todoHeaderObj.title = param.title
            todoHeaderObj.description = param.description
            todoHeaderObj.image = param.image

            updateTodoHeader(todoHeaderObj)

            Ok(res, "Update Success")


        } catch (error) {
            console.error("TodoController.doUpdate", error)
            InternalServerErr(res, "Error during update")
        }
    }

    async doUpdateStatus(req, res){
        const param = req.body
        try {
            let todoHeaderObj = getOneTodoHeader({todo_header_id : param.todo_header_id})
            if(!todoHeaderObj){
                BadRequest(res, "Data not found")
                return
            }

            let result = {...todoHeaderObj}
            result.status = param.status

            let todos = getTodoByTodoHeader(result)
            for(let todo of todos){
                let paramTodoUpdate = {...todo}
                paramTodoUpdate.status = param.status
                let todoDetails = getTodoDetailByTodo({todo_id : todo.todo_id})
                for(let todoDet of todoDetails){
                    let paramDet = {...todoDet}
                    paramDet.status = param.status
                    updateTodoDetail(paramDet)
                }
                updateTodo(paramTodoUpdate)
            }

            updateTodoHeader(result)

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
                let todoHeaderObj = getOneTodoHeader({todo_header_id : param.todo_header_id})
                if(todoHeaderObj)
                    deleteTodoHeader(todoHeaderObj)
            }

            Ok(res, "Delete Success")


        } catch (error) {
            console.error("TodoController.doMultipleDelete", error)
            InternalServerErr(res, "Error during Delete")
        }
    }
}

module.exports = new TodoController()
