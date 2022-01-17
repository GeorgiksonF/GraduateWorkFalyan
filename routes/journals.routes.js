const {Router} = require('express')
const Journal = require('../models/Journal')
const router = Router()


// api/journals
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
        
        const journals = await Journal.find(findParams)
                .sort(sortParams)
                .limit(size)
                .skip(size * page)
                .exec()
        
        const count = await Journal.count(findParams).exec()

        return res.status(201).json({
            journals,
            total: count,
        })
    } catch (e) {
        return res.status(500).json({message: 'Somethings going wrong, try again!'})
    }
})

module.exports = router