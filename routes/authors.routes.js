const {Router} = require('express')
const Author = require('../models/Author')
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
            return await Article.findById(articleId, '_id title').exec()
        }))
        
        return res.status(201).json({
            author
        })
    } catch (e) {
        return res.status(500).json({message: 'Somethings going wrong, try again!'})
    }
})

module.exports = router