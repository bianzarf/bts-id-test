let userDb = [
    {
        username : "bts.id",
        name : "BTS Admin",
        email : "bts.id@gmail.com",
        password : "$2b$10$Cr51L/qK7O.uneZp.fwCEefWfLyvnBo33DdLWzU4dXAE/0CIxa63e",
    }
]

const getOneUser = (param, withPassword=false) => {
    let user = userDb.find(obj => obj.username == param.username)

    if(user && !withPassword)
        delete user.password
    
    return user;
};
const getOneUserEmail = (param, withPassword=false) => {
    let user = userDb.find(obj => obj.email == param.email)

    if(user && !withPassword)
        delete user.password
    
    return user;
};

const insertUser = (param) => {
    userDb.push(param)
};

module.exports = {
    getOneUser,
    getOneUserEmail,
    insertUser
}