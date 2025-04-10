require('dotenv').config();
const express = require('express')
const { errors } = require('celebrate')
const bodyParser = require('body-parser');
const helmet = require('helmet')
const cors = require('cors')


const app = express();
const routes = require('./src/routes')
const host = process.env.SERVER_HOST || 'localhost'
const port = process.env.SERVER_PORT || 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use(cors())

app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            'style-src': ["'self'"],
            'form-action': ["'self'"],
            'font-src': ["'self'"],
            'block-all-mixed-content': null,
            'upgrade-insecure-requests': null
        }
    }
}))

app.use('/api/v1', routes)

app.use(errors());


app.listen(port, host, ()=> {
    console.log(`Server started, listening on ${host}:${port}!`)
})