const fs = require('fs')
let articles = require('./articles.json')
let journals = require('./journals.json')

articles = articles.map(article => {
    let journal = journals.find(journal => article.source.toLowerCase() === journal.title.toLowerCase())

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

fs.writeFile('./data.json', JSON.stringify(articles), err => err)

console.log(articles)