const { getOneTodo, insertTodo, updateTodo, deleteTodo, getTodoByTodoHeader } = require("../model/Todo")
const { search, insertTodoDetail, getOneTodoDetail, updateTodoDetail, deleteTodoDetail, getTodoDetailByTodo } = require("../model/TodoDetail")
const { getOneTodoHeader, updateTodoHeader } = require("../model/TodoHeader")
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
            let todoDetailObj = getOneTodoDetail({todo_detail_id : param.todo_detail_id})
            if(!todoDetailObj){
                BadRequest(res, "Data not found")
                return
            }

            let result = {...todoDetailObj}
            result.status = param.status

            updateTodoDetail(result)

            // check if all todo detail is true or false

            // todo
            let todoObj = getOneTodo({todo_id : todoDetailObj.todo_id})
            let todoDetails = getTodoDetailByTodo({todo_id : todoDetailObj.todo_id})
            let isAllTrue = todoDetails.filter(obj => obj.status == true)
            if(isAllTrue.length == todoDetails.length){
                if(todoObj){
                    let paramTodo = {...todoObj}
                    paramTodo.status = true

                    updateTodo(paramTodo)
                }
            }else{
                if(todoObj){
                    let paramTodo = {...todoObj}
                    paramTodo.status = false

                    updateTodo(paramTodo)
                }
            }

            // todo header
            let todoHeaderObj = getOneTodoHeader({todo_header_id : todoObj.todo_header_id})
            let todos = getTodoByTodoHeader({todo_header_id : todoObj.todo_header_id})
            let isAllTrueHeader = todos.filter(obj => obj.status == true)
            if(isAllTrueHeader.length == todos.length){
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
