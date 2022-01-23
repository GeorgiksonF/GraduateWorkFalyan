const {Router} = require('express')
const Author = require('../models/Author')
const Journal = require('../models/Journal')
const Article = require('../models/Article')
const router = Router()


// api/authors
router.post('/', async (req, res) => {
    try {
        const {page, size, sortField, order, search} = req.body
        const findParams = {}
        const sortParams = {}
        
        if (search && search !== '') {
            findParams['author'] = {$regex: search,  $options: 'i'}
        }
        
        if (sortField && sortField !== '') {
            sortParams[sortField] = order
        }
        
        let authors = await Author.find(findParams)
                .sort(sortParams)
                .limit(size)
                .skip(size * page)
                .exec()
        
        const count = await Author.count(findParams).exec()

        return res.status(201).json({
            authors,
            total: count
        })
    } catch (e) {
        return res.status(500).json({message: 'Somethings going wrong, try again!'})
    }
})

// api/authors/id=:id
router.post('/id=:id', async (req, res) => {
    try {
        const {authorId} = req.body
        
        let author = await Author.findById(authorId).exec()
        
        author.articles = await Promise.all(author.articles.map(async articleId => {
            return await Article.findById(articleId, '_id title rating journal published').exec()
        }))
       
        author.articles = await Promise.all(author.articles.map(async article => {
            article.journal = await Journal.findById(article.journal, '_id title').exec()
            return article
        }))
        
        let years = []
        let articlesRating = author.articles.map(x => {
            let year = +x.published.trim().match(/\d{4}/gm)[0]
            let rating = x.rating

            if (!years.includes(year)) {
                years.push(year)
            }

            return {
                year,
                rating
            }
        })

        let startRating = 0
        let ratingByYear = years.sort().map(year => {
            let rating = articlesRating
                .filter(x => x.year === year)
                .map(x => x.rating)
                .reduce((sum, current) => sum + current, 0)
            rating = Math.round((rating + startRating) * 100) / 100
            startRating = rating
            return {
                year,
                rating
            }
        })
        
        return res.status(201).json({
            author,
            ratingByYear
        })
    } catch (e) {
        return res.status(500).json({message: 'Somethings going wrong, try again!'})
    }
})

module.exports = router