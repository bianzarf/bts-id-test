let todoDb = [
    {
        todo_id : "f340fef9-18b7-46f9-bdb8-0196b734d6c3",
        todo_name : "Create TO-DO List API",
        created_by : "bts.id",
        status : false
    }
]

const search = (param) => {
    let result = todoDb

    if(param.todo_name){
        result = result.filter(obj => obj.todo_name.includes(param.todo_name) )
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
const getOneTodo = (param) => {
    let todo = todoDb.find(obj => obj.todo_id == param.todo_id)

    if(param.created_by && todo){
        if(todo.created_by != param.created_by)
            todo = null
    }

    return todo;
};

const insertTodo = (param) => {
    todoDb.push(param)
};

const updateTodo = (param) => {
    let idx = todoDb.findIndex(obj => obj.todo_id == param.todo_id)
    if(idx != null)
        todoDb[idx] = param  
};
const deleteTodo = (param) => {
    let idx = todoDb.findIndex(obj => obj.todo_id == param.todo_id)
    if(idx != null)
        todoDb.splice(idx, 1)
};



module.exports = {
    search,
    getOneTodo,
    insertTodo,
    updateTodo,
    deleteTodo,
    
}