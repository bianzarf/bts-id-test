const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

const verifyJwt = (req, token) => {
    try {
        var decoded = jwt.verify(token, secret);
        
        req.user = {
            username: decoded.data,
            name: decoded.name
        }
        return true
    } catch(err) {
        return false
    }
}

const createJwtToken = (username, name) => {
    let expires = process.env.JWT_EXPIRED
    return jwt.sign({
        name,
        data: username,
    }, secret, { expiresIn: expires });
}

module.exports = { verifyJwt, createJwtToken }