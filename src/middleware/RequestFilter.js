const { getOneUser } = require("../model/User")
const { verifyJwt } = require("../util/JwtUtil")
const { Unauthorized } = require("../util/ResponseUtil")



const getToken = (bearer) => {
    return bearer.slice(7, bearer.length)
}


const JwtFilter = async (req, res, next) => {
    let token
    if(req.headers.authorization) {
        token = getToken(req.headers.authorization)
    } else if(req.query.token) {
        token = req.query.token        
    }

    if(token) {
        if(verifyJwt(req, token)) {
            const { username, name } = req.user
            const userObj = getOneUser({username : username})
            if(userObj == null) {
                // console.log(`Username: ${username} is not exists, probably deleted.`)
                Unauthorized(res, 'User does not exist anymore', "401-1")
            } else {
                if(userObj != null) {
                    req.query.created_by = userObj.username
                    req.params.created_by = userObj.username
                    req.user.username = userObj.username
                    req.user.name = name
                    req.user.token = token
                }
                next()
            }
        } else {
            console.log('Token is not valid')
            Unauthorized(res, 'Token is not valid', "401-1")
        }
    } else {
        console.log('Token is missing')
        Unauthorized(res, 'Token is missing' )
    }
}

module.exports = {
    JwtFilter
}