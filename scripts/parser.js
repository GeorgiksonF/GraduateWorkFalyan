const fs = require('fs')
const path = require('path')
const jsdom = require("jsdom");
const csv = require('csv-parser')

const { JSDOM } = jsdom;
const articlesPath = path.join(__dirname, 'db.html');
const journalsPath = path.join(__dirname, 'scimagojr.csv')

const requiredAttributes = [
    'Title', 'Author(s):', 'Source',
    'Volume', 'Issue', 'Published',
    'DOI', 'Abstract', 'Accession Number',
    'ISSN', 'eISSN', 'Article Number', 'Pages',
    'Book Series', 'Supplement', 'Part'
]

// articles parser

fs.readFile(articlesPath, (err, html) => {
    const htmlDOM = new JSDOM(html.toString())
    const articles = [...htmlDOM.window.document.querySelectorAll("table")]

    let articlesData = articles.map(article => {
        let articleData = {}
        let tbody = [...article.childNodes].filter(node => node.nodeName === 'TBODY')[0]
        
        for (field of tableRowParser([...tbody.childNodes])) {
            articleData = {
                ...articleData,
                ...field
            }
        }
        
        return articleData
    }).filter(article => Object.keys(article).length !== 0)
    
    articlesData.forEach(article => {
        article.authors = setAuthArr(article.authors)
    })

    fs.writeFile('./scripts/articles.json', JSON.stringify(articlesData), err => err)
    journalsParse()
});

const tableRowParser = (rows) => {
    rows = rows.filter(row => row.nodeName === 'TR')
    
    return rows.map(row => {
        let cells = [...row.childNodes].filter(row => row.nodeName === 'TD')
        return cells.map(cell => tableCellParser([...cell.childNodes]))[0]
    })
}

const tableCellParser = (cell) => {
    
    let keys = []
    let values = []
    let data = {}

    let cellChildren = cell.filter(el => el.textContent.trim() !== '');

    cellChildren.forEach(el => {
        if (el.nodeName === 'B' && isRequiredAttributes(el.textContent)) {
            el.textContent = setCorrectKey(el.textContent).trim().slice(0, -1).toLowerCase()
            keys.push(el.textContent)
        } else if (el.nodeName === '#text' || el.nodeName === 'VALUE') {
            values.push(el.textContent.trim())
        }
    })

    keys.forEach((key, i) => {
        data[key] = values[i]
    })
    
    return data
}

const isRequiredAttributes = (text) => {
    for (attr of requiredAttributes) {
        if (text.includes(attr) &&
            !text.includes('Book Group Author(s)') && 
            !text.includes('Group Author(s)')) {
            return true
        }
    }
    
    return false
}

const setCorrectKey = (text) => {
    if (text.includes('Author(s)')) {
        return 'authors:'
    } else if (text.includes('Book Series')) {
        return 'book_series:'
    } else if (text.includes('Article Number')) {
        return 'article_number:'
    } else if (text.includes('Accession Number')) {
        return 'accession_number:'
    }

    return text
}

const setAuthArr = (authStr) => {
    return authStr.split(';').map(author => {
        return author.trim().match(/^\w+(-\w+|\s\w+|\'\w+)*(,\s[A-Z]+|\b)/gm)[0]
            .replace(',', '')
            .replace('\'', '',)
    })
}

// journals parser

const journalsParse = () => {
    const journals = [];
    
    fs.createReadStream(journalsPath)
        .pipe(csv({separator: ';'}))
        .on('data', (data) => journals.push(data))
        .on('end', () => {
            let journalsData = journals.map(journal => {
                if (!journal.SJR) {
                    journal.SJR = '0'
                }
                return {
                    title: journal.Title,
                    impact_factor: +journal.SJR.replace(',', '.'),
                    journal_country: journal.Country,
                    issn: journal.Issn
                }
            })
        fs.writeFile('./scripts/journals.json', JSON.stringify(journalsData), err => err)
    });
}