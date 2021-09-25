const fs = require('fs')
const path = require('path')
const jsdom = require("jsdom");

const { JSDOM } = jsdom;
const filePath = path.join(__dirname, 'db.html');


fs.readFile(filePath, (err, html) => {
    const htmlDOM = new JSDOM(html.toString())
    const articles = [...htmlDOM.window.document.querySelectorAll("table")]

    const articlesData = articles.map(article => {
        let articleData = {}
        let tbody = [...article.childNodes].filter(node => node.nodeName === 'TBODY')[0]
        
        for (field of tableRowParser([...tbody.childNodes])) {
            articleData = {
                ...articleData,
                ...field
            }
        }
        if (Object.keys(articleData).length !== 0) {
            return articleData
        }
    }).filter(article => article)

    console.log(articlesData)
    return articlesData
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
        if (el.nodeName === 'B') {
            keys.push(el.textContent.trim())
        } else if (el.nodeName === '#text' || el.nodeName === 'VALUE') {
            values.push(el.textContent.trim())
        }
    });
    
    keys.forEach((key, i) => {
        data[key] = values[i]
    })

    return data
}