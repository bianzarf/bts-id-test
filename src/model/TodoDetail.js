let todoDetailDb = [
    {
        todo_detail_id : "a11250a3-db1d-4c94-8f9f-ec7e05bb37df",
        todo_id : "f340fef9-18b7-46f9-bdb8-0196b734d6c3",
        todo_detail_name : "Create TO-DO Detail Checklist",
        created_by : "bts.id",
        status : false
    }
]

const search = (param) => {
    let result = todoDetailDb

    if(param.todo_id){
        result = result.filter(obj => obj.todo_id = param.todo_id )
    }
    if(param.todo_detail_name){
        result = result.filter(obj => obj.todo_detail_name.includes(param.todo_detail_name) )
    }
    if(param.created_by){
        result = result.filter(obj => obj.created_by = param.created_by )
    }

    let totalRows = result.length;

    // limit and paging and such
    let limit = 5;
    if (param.perPage && param.perPage != '') {
        limit = param.perPage;
    }

    let offset = 0;
    if (param.page && param.page != '') {
        offset = limit * (param.page - 1);
    }

    result = result.slice(offset, limit)

    let totalPages = Math.ceil(totalRows / param.perPage);

    return {
        page: param.page,
        perPage: param.perPage,
        totalRows,
        totalPages,
        result,
    };
};
const getOneTodoDetail = (param) => {
    let todoDetail = todoDetailDb.find(obj => obj.todo_detail_id == param.todo_detail_id)

    if(param.created_by && todoDetail){
        if(todoDetail.created_by != param.created_by)
            todoDetail = null
    }

    return todoDetail;
};

const getTodoDetailByTodo = (param) => {
    let todoDetail = todoDetailDb.filter(obj => obj.todo_id == param.todo_id)

    if(param.created_by){
        todoDetail = todoDetail.filter(obj => obj.created_by = param.created_by )
    }

    return todoDetail;
};

const insertTodoDetail = (param) => {
    todoDetailDb.push(param)
};

const updateTodoDetail = (param) => {
    let idx = todoDetailDb.findIndex(obj => obj.todo_id == param.todo_id)
    if(idx != null)
        todoDetailDb[idx] = param  
};
const deleteTodoDetail = (param) => {
    let idx = todoDetailDb.findIndex(obj => obj.todo_id == param.todo_id)
    if(idx != null)
        todoDetailDb.splice(idx, 1)
};



module.exports = {
    search,
    getOneTodoDetail,
    getTodoDetailByTodo,
    insertTodoDetail,
    updateTodoDetail,
    deleteTodoDetail,
    
}