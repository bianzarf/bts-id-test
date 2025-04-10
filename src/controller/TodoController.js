const { search, getOneTodo, insertTodo, updateTodo, deleteTodo, getTodoByTodoHeader } = require("../model/Todo")
const { getTodoDetailByTodo, updateTodoDetail } = require("../model/TodoDetail")
const { getOneTodoHeader, updateTodoHeader } = require("../model/TodoHeader")
const { BadRequest, Ok, InternalServerErr, Unauthorized, SearchOk } = require("../util/ResponseUtil")
const StringUtil = require("../util/StringUtil")

class TodoController {
    async doSearch(req, res) {
        const param = req.query
        try {
            const { page, perPage, totalPages, totalRows, result } = search(param)

            for(let r of result){
                r.detail = getTodoDetailByTodo({todo_id : r.todo_id})
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
            let todoObj = getOneTodo(param)
            if(!todoObj){
                BadRequest(res, "Data not found")
                return
            }

            let result = {...todoObj}

            result.detail = getTodoDetailByTodo({todo_id : param.todo_id})

            Ok(res, "Data Found", result)


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

            let result = {...todoObj} 
            result.status = param.status

            let todoDetails = getTodoDetailByTodo(result)
            for(let todoD of todoDetails){
                let paramD = {...todoD}
                paramD.status = param.status

                updateTodoDetail(paramD)
            }

            updateTodo(result)

            // check if all todo is true or false
            let todoHeaderObj = getOneTodoHeader({todo_header_id : todoObj.todo_header_id})
            let todos = getTodoByTodoHeader({todo_header_id : todoObj.todo_header_id})
            let isAllTrue = todos.filter(obj => obj.status == true)
            if(isAllTrue.length == todos.length){
                if(todoHeaderObj){
                    let paramTodoHeader = {...todoHeaderObj}
                    paramTodoHeader.status = true

                    updateTodoHeader(paramTodoHeader)
                }
            }else{
                if(todoHeaderObj){
                    let paramTodoHeader = {...todoHeaderObj}
                    paramTodoHeader.status = false

                    updateTodoHeader(paramTodoHeader)
                }
            }

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
