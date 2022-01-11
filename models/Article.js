const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    title: String,
    journal: {
        type: Types.ObjectId,
        ref: 'Journal'
    },
    abstract: String,
    published: String,
    authors: [{
        type: Types.ObjectId,
        ref: 'Author'
    }],
    rating: Number,
    doi: String,
    volume: Number,
    issue: Number
})

module.exports = model('Article', schema)