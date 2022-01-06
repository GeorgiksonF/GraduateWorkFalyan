const fs = require('fs')
const mongoose = require('mongoose')
const config = require('config')
const data = require('../data.json')
const _ = require('lodash')
const { forEach } = require('lodash')
const { Schema } = mongoose;

const connection = async () => {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        main()
    } catch (e) {
        console.log('Server error ', e.message)
        process.exit(1)
    }
}

connection()

const main = () => {
    const articlesSchema = new Schema({
        title: String,
        journal: {
            type: Schema.Types.ObjectId,
            ref: 'Journal'
        },
        abstract: String,
        published: String,
        authors: [{
            type: Schema.Types.ObjectId,
            ref: 'Author'
        }],
        rating: Number,
        doi: String,
        volume: Number,
        issue: Number
    })
    
    const journalsSchema = new Schema({
        title: String,
        impact_factor: Number,
        issn: String,
        eissn: String,
        country: String, 
    })
    
    const authorsSchema = new Schema({
        author: String,
        articles: [{
            type: Schema.Types.ObjectId,
            ref: 'Article'
        }]
    })
    
    const Article = mongoose.model('Article', articlesSchema)
    const Journal = mongoose.model('Journal', journalsSchema)
    const Author = mongoose.model('Author', authorsSchema)
    
    let articlesFilling = async () => {
        let objects = await Promise.all(data.map(async el => {
            // web of science and scopus A = 30
            let rating = Math.round(30 * (1 + el.impact_factor) / el.authors.length * 100) / 100 
            let journal = await Journal.findOne({title: el.source}, '_id').exec()
            let authors = await Promise.all(el.authors.map(async x => {
                return await Author.findOne({author: x}, '_id').exec()
            }))
            return {
                title: el.title || '',
                journal: journal._id || null,
                abstract: el.abstract || '',
                published: el.published || '',
                authors: authors || [],
                rating: rating,
                doi: el.doi || '',
                volume: +el.volume || null,
                issue: +el.issue || null
            }
        }))
        console.log(objects.length)
        let article = null
        objects.forEach(async el => {
            article = new Article(el)
            await article.save()
        })
    }
    
    let authorsFilling = () => {
        let authors = _.uniq(data.flatMap(el => el.authors))
    
        let objects = authors.map(author => {
            return {
                author,
                // articles: []
            }
        })
    
        objects = _.uniqBy(objects, el => el.author)
        console.log(objects.length)
        let author = null
        objects.forEach(async el => {
            author = new Author(el)
            await author.save()
        })
    }
    
    let journalsFilling = () => {
        let objects = data.map(el => {
            return {
                title: el.source || '',
                impact_factor: el.impact_factor || null,
                issn: el.issn || '',
                eissn: el.eissn || '',
                country: el.journal_country || '', 
            }
        })
    
        objects = _.uniqBy(objects, el => el.issn || el.eissn)
        console.log(objects.length)
        let journal = null
        objects.forEach(async el => {
            journal = new Journal(el)
            await journal.save()
        })
    }

    const authorArticlesFilling = async () => {
        let authors = await Author.find({}).exec()
        authors.forEach(async el => {
            let articles = await Article.find({authors: {$in: [el._id]}}, '_id').exec()
            el.articles = [...articles]
            await el.save()
        })
    }
    
    let init = () => {
        // journalsFilling()
        // authorsFilling()
        // articlesFilling()
        authorArticlesFilling()
    }
    
    // console.log(data)
    init()
}
