const { getOneUser, getOneUserEmail, insertUser } = require("../model/User")
const { createJwtToken } = require("../util/JwtUtil")
const { BadRequest, Ok, InternalServerErr, Unauthorized } = require("../util/ResponseUtil")
const StringUtil = require("../util/StringUtil")
const bcrypt = require('bcrypt')
const saltRounds = parseInt(process.env.SALT_ROUND)

let userDb = [
    {
        username : "bts.id",
        name : "BTS Admin",
        email : "bts.id@gmail.com",
        password : "$2b$10$Cr51L/qK7O.uneZp.fwCEefWfLyvnBo33DdLWzU4dXAE/0CIxa63e",
    }
]

class AuthController {
    async login(req, res) {
        const param = req.body;
        try {
            const user = getOneUser(param, true)
            if(!user){
                Unauthorized(res, "Login Failed, user is inactive or not registered")
                return
            }
           
            const match = await bcrypt.compare(param.password, user.password);

            if(match){
                Ok(res, "Login Success", {
                    token : createJwtToken(user.username, user.name),
                    username : user.username,
                    name : user.name
                })
            }else{
                Unauthorized(res, "Login Failed, Incorrect Username or Password")
            }

        } catch (error) {
            console.error("Authcontroller.login", error)
            InternalServerErr(res, "Error during login")
        }

    }

    async register(req, res){
        let param = req.body
        try {
            param.username = StringUtil.lowerCaseText(param.username)
            param.username = StringUtil.removeWhiteSpace(param.username)
            const usernameIsExist = getOneUser(param)
            if(usernameIsExist){
                BadRequest(res, `Username ${param.username} is already registered`)
                return
            }
            const emailIsExist = getOneUserEmail(param)
            if(emailIsExist){
                BadRequest(res, `Email ${param.email} is already registered`)
                return
            }

            let hash = await bcrypt.hash(param.password, saltRounds)
            if(hash){
                param.password = hash
                

                insertUser(param)
                Ok(res, "successfully registered")
            }else{
                InternalServerErr(res, "Error during register")
            }


        } catch (error) {
            console.error("Authcontroller.register", error)
            InternalServerErr(res, "Error during register")
        }
    }
}

module.exports = new AuthController()
