const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
var bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use('/api/articles', require('./routes/articles.routes'))
app.use('/api/journals', require('./routes/journals.routes'))
app.use('/api/authors', require('./routes/authors.routes'))

const PORT = config.get('port') || 5000
const start = async () => {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (e) {
        console.log('Server error ', e.message)
        process.exit(1)
    }
}


start()

app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))