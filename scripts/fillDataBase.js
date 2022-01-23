const mongoose = require('mongoose')
const config = require('config')
const data = require('../data.json')
const _ = require('lodash')

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
    const Article = require('../models/Article')
    const Journal = require('../models/Journal')
    const Author = require('../models/Author')
    
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
    
        let objects = authors.map(author => ({author}))
    
        objects = _.uniqBy(objects, el => el.author)
        console.log(objects.length)
        let author = null
        objects.forEach(async el => {
            let hasAuthor = await Author.findOne({author: el.author}).exec()
            if (!hasAuthor) {
                author = new Author(el)
                await author.save()
            }
        })
    }
    
    let journalsFilling = () => {
        let objects = data.map(el => ({
                title: el.source || '',
                impact_factor: el.impact_factor || null,
                issn: el.issn || '',
                eissn: el.eissn || '',
                country: el.journal_country || '', 
        }))
    
        objects = _.uniqBy(objects, el => el.title)
        console.log(objects.length)
        let journal = null
        objects.forEach(async el => {
            let hasJournal = await Journal.findOne({title: el.title}).exec()
            if (!hasJournal) {
                journal = new Journal(el)
                await journal.save()
            }
        })
    }

    const authorArticlesFilling = async () => {
        let authors = await Author.find({}).exec()
        authors.forEach(async el => {
            let articles = await Article.find({authors: {$in: [el._id]}}, '_id rating').exec()
            let authorRating = articles.reduce((rating, el) => rating + el.rating, 0)
            el.rating = Math.round(authorRating * 100) / 100
            el.articles = articles.map(x => x._id)
            await el.save()
        })
        console.log('end')
    }
    
    let init = async () => {
        // journalsFilling()
        // authorsFilling()
        // articlesFilling()
        authorArticlesFilling()
    }
    
    // console.log(data)
    init()
}
