const Ok = (res, msg, data) => {
    createMsg(res, 200, msg, data)
}

const BadRequest = (res, msg, data) => {
    createMsg(res, 400, msg, data, "Bad Request")
}

const Unauthorized = (res, msg, msgCode="401-1") => {
    let data = {
        msgCode
    }
    createMsg(res, 401, msg, data, "Unauthorized")
}

const InternalServerErr = (res, msg, data=undefined) => {
    createMsg(res, 500, msg, data, "Internal Server Error")
}

const SearchOk = (res, page, perPage, totalRows, totalPages, data) => {
    res.append('Access-Control-Expose-Headers', 'Page, Per-Page, Total-Rows, Total-Pages')
    res.append('Page', page)
    res.append('Per-Page', perPage)
    res.append('Total-Rows', totalRows)
    res.append('Total-Pages', totalPages)
    const msg = data.length > 0 ? "Data found" : "Data not found"
    createMsg(res, 200, msg, data)
}

const createMsg = (res, statusCode, message = "", data, error) => {
    res.status(statusCode).send({
        statusCode,
        message,
        data,
        error
    })
}

module.exports = { Ok, BadRequest, Unauthorized, InternalServerErr, SearchOk }