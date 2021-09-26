const fs = require('fs')
const path = require('path')
const jsdom = require("jsdom");

const { JSDOM } = jsdom;
const filePath = path.join(__dirname, 'db.html');

const requiredAttributes = [
    'Title', 'Author(s)', 'Source',
    'Volume', 'Issue', 'Published',
    'DOI', 'Abstract', 'Accession Number',
    'ISSN', 'eISSN',
]

fs.readFile(filePath, (err, html) => {
    const htmlDOM = new JSDOM(html.toString())
    const articles = [...htmlDOM.window.document.querySelectorAll("table")].slice(1, 3)

    let articlesData = articles.map(article => {
        let articleData = {}
        let tbody = [...article.childNodes].filter(node => node.nodeName === 'TBODY')[0]
        
        for (field of tableRowParser([...tbody.childNodes])) {
            articleData = {
                ...articleData,
                ...field
            }
        }

        articleData.authors = setAuthArr(articleData.authors)

        return articleData
    }).filter(article => Object.keys(article).length !== 0)

    console.log(articlesData)
    articlesData = JSON.stringify(articlesData);
    fs.writeFile('./articles.json', articlesData, err => err);
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
    });
    
    keys.forEach((key, i) => {
        data[key] = values[i]
    })
    
    return data
}

const isRequiredAttributes = (text) => {
    for (attr of requiredAttributes) {
        if (text.includes(attr)) {
            return true
        }
    }

    return false
}

const setCorrectKey = (text) => {
    if (text.includes('Author(s)')) {
        return 'authors:'
    } else if (text.includes('Accession Number')) {
        return 'accession_number:'
    }

    return text
}

const setAuthArr = (authStr) => {
    return authStr.split(';').map(autor => {
        return autor.match(/^.+?\s.+?\s/)[0].trim().replace(',', '')
    })
}