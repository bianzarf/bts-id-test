const { v4: uuidv1 } = require('uuid')

class StringUtil{
    lowerCaseText(text){
        return text.toLowerCase();
    }

    removeWhiteSpace(text){
        const regex = /\s/g
        return text.replace(regex, "")
    }

    getUUID() {
        return uuidv1()
    } 
}

module.exports = new StringUtil()