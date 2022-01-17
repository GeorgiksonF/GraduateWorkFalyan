const {Router} = require('express')
const Article = require('../models/Article')
const Journal = require('../models/Journal')
const Author = require('../models/Author')
const router = Router()


// api/articles
router.post('/', async (req, res) => {
    try {
        const {page, size, sortField, order, search} = req.body
        const findParams = {}
        const sortParams = {}
         
        if (search && search !== '') {
            findParams['title'] = {$regex: search,  $options: 'i'}
        }
        
        if (sortField && sortField !== '') {
            sortParams[sortField] = order
        }
        
        const articles = await Article.find(findParams)
            .sort(sortParams)
            .limit(size)
            .skip(size * page)
            .exec()
        
        const count = await Article.count(findParams).exec()

        return res.status(201).json({
            articles: articles,
            total: count
        })
    } catch (e) {
        return res.status(500).json({message: 'Somethings going wrong, try again!'})
    }
})

// api/articles/id=:id
router.post('/id=:id', async (req, res) => {
    try {
        const {articleId} = req.body
        const article = await Article.findById(articleId).exec()
        
        article.journal = await Journal.findById(article.journal, '_id title').exec()
        
        article.authors = await Promise.all(article.authors.map(async author => {
            return await Author.findById(author, '_id author').exec()
        }))
        
        return res.status(201).json({
            article
        })
    } catch (e) {
        return res.status(500).json({message: 'Somethings going wrong, try again!'})
    }
})

module.exports = router