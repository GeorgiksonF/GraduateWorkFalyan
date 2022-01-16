import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:5000',
});

export const publicationsApi = {
    getArticles(data) {
        return instance.post(`/api/articles`, data, {"Content-Type": "application/json"})
                .then(res => res)
    },
    getArticleBuId(data) {
        // console.log(data)
        return instance.post(`/api/articles/id=${data.articleId}`, data, {"Content-Type": "application/json"})
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
    getAuthorById(data) {
        return instance.post(`/api/authors/id=${data.authorId}`, data, {"Content-Type": "application/json"})
                .then(res => res)
    }
}