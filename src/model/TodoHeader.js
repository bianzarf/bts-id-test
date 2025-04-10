let todoHeaderDb = [
    {
        todo_header_id : "37ccc121-4bcf-4099-a931-9116d055b6ce",
        title : "Create TO-DO List API",
        description : "todo list api for testing bts.id",
        image: "",
        created_by : "bts.id",
        status : false
    }
]

const search = (param) => {
    let result = todoHeaderDb

    if(param.title){
        result = result.filter(obj => obj.title.includes(param.title) )
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
const getOneTodoHeader = (param) => {
    let todo = todoHeaderDb.find(obj => obj.todo_header_id == param.todo_header_id)

    if(param.created_by && todo){
        if(todo.created_by != param.created_by)
            todo = null
    }

    return todo;
};

const insertTodoHeader = (param) => {
    todoHeaderDb.push(param)
};

const updateTodoHeader = (param) => {
    let idx = todoHeaderDb.findIndex(obj => obj.todo_header_id == param.todo_header_id)
    if(idx != null)
        todoHeaderDb[idx] = param  
};
const deleteTodoHeader = (param) => {
    let idx = todoHeaderDb.findIndex(obj => obj.todo_header_id == param.todo_header_id)
    if(idx != null)
        todoHeaderDb.splice(idx, 1)
};



module.exports = {
    search,
    getOneTodoHeader,
    insertTodoHeader,
    updateTodoHeader,
    deleteTodoHeader,
    
}