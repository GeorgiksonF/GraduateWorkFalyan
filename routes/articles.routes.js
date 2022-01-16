const {Router} = require('express')
const Article = require('../models/Article')
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
        
        const count = await Article.count().exec()
        const finded = articles.length
        return res.status(201).json({
            articles: articles,
            total: count,
            finded: finded
        })
    } catch (e) {
        return res.status(500).json({message: 'Somethings going wrong, try again!'})
    }
})

module.exports = router