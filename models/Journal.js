const {Schema, model} = require('mongoose')

const schema = new Schema({
    title: String,
    impact_factor: Number,
    issn: String,
    eissn: String,
    country: String, 
})

module.exports = model('Journal', schema)