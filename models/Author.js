const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    author: String,
    articles: [{
        type: Types.ObjectId,
        ref: 'Article'
    }],
    rating: Number
})

module.exports = model('Author', schema)