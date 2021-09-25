const fs = require('fs')
const path = require('path')
const jsdom = require("jsdom");

const { JSDOM } = jsdom;
const filePath = path.join(__dirname, 'db.html');
const exclusionAttrs = ['record', 'early access']

fs.readFile(filePath, (err, html) => {
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
        if (el.nodeName === 'B' && !isExclusionAttrs(el.textContent)) {
            if (el.textContent.toLowerCase().includes('author')) {
                el.textContent = 'Authors:'
            } 
            if (el.textContent.toLowerCase().includes('accession')) {
                el.textContent = 'Accession_Number:'
            }

            keys.push(el.textContent.trim().slice(0, -1))
        } else if (el.nodeName === '#text' || el.nodeName === 'VALUE') {
            values.push(el.textContent.trim())
        }
    });
    
    keys.forEach((key, i) => {
        data[key] = values[i]
    })

    return data
}

const isExclusionAttrs = (text) => {
    for (attr of exclusionAttrs) {
        if (text.toLowerCase().includes(attr)) {
            return true
        }
    }

    return false
}