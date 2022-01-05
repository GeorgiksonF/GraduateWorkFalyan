const fs = require('fs')
let articles = require('./articles.json')
let journals = require('./journals.json')

articles = articles.map(article => {
    let journal = journals.find(journal => {
        if (article.issn) {
            return journal.issn.includes(article.issn.replace('-', ''))
        }
        
        if (article.eissn) {
            return journal.issn.includes(article.eissn.replace('-', ''))
        }

        return article.source.toLowerCase() === journal.title.toLowerCase()
    })

    if (journal) {
        return {
            ...article,
            impact_factor: journal.impact_factor,
            journal_country: journal.journal_country
        }
    }

    return {
        ...article,
        impact_factor: 0,
        journal_country: 'Null'
    }
})


console.log(articles)

fs.writeFile('./data.json', JSON.stringify(articles), err => err)