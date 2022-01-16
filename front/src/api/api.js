import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:5000',
});

export const publicationsApi = {
    getArticles(data) {
        return instance.post(`/api/articles`, data, {"Content-Type": "application/json"})
                .then(res => res)
    },
    getArticleInfo(data) {
        console.log(data)
        return instance.post(`/api/articles/id=${data.id}`, data, {"Content-Type": "application/json"})
                .then(res => res)
    }
}

export const journalsApi = {
    getJournals(data) {
        return instance.post(`/api/journals`, data, {"Content-Type": "application/json"})
                .then(res => res)
    }
}

export const authorsApi = {
    getAuthors(data) {
        return instance.post(`/api/authors`, data, {"Content-Type": "application/json"})
                .then(res => res)
    },
    getAuthorById(authorId) {
        console.log(authorId)
        return instance.post(`/api/authors/id=${authorId}`, authorId, {"Content-Type": "application/json"})
    }
}