const fs = require('fs')
const mongoose = require('mongoose')
const config = require('config')
const data = require('../data.json')
const _ = require('lodash')

const { Schema } = mongoose;
const main = async () => {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (e) {
        console.log('Server error ', e.message)
        process.exit(1)
    }
    
    const articlesSchema = new Schema({
        title: String,
        joural: String,
        abstract: String,
        published: String,
        authors: [],
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
        articles: []
    })
    
    const Article = mongoose.model('Article', articlesSchema)
    const Journal = mongoose.model('Journal', journalsSchema)
    const Author = mongoose.model('Author', authorsSchema)
    
    let articlesFilling = () => {
        let objects = data.map(el => {
            // web of science and scopus A = 30
            let rating = Math.round(30 * (1 + el.impact_factor) / el.authors.length * 100) / 100 
            return {
                title: el.title || '',
                joural: el.source || '',
                abstract: el.abstract || '',
                published: el.published || '',
                authors: el.authors || [],
                rating: rating,
                doi: el.doi || '',
                volume: +el.volume || null,
                issue: +el.issue || null
            }
        })
        
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
    
        console.log(objects)
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
    
        console.log(objects)
    }
    
    let init = () => {
        articlesFilling()
        // journalsFilling()
        // authorsFilling()
    }
    
    // console.log(data)
    init()
}

main()

