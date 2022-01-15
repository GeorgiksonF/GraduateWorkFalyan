const {Router} = require('express')
const Article = require('../models/Article')
const router = Router()


// api/articles
router.post('/', async (req, res) => {
    try {
        const {page, size, sortField, order, search} = req.body

        const articles = await Article.find({})
            .sort({[sortField]: order || 1})
            .limit(size)
            .skip(size * page)
            .exec()
        
        const count = await Article.count().exec()

        return res.status(201).json({
            articles: articles,
            total: count
        })
    } catch (e) {
        return res.status(500).json({message: 'Somethings going wrong, try again!'})
    }
})

module.exports = router