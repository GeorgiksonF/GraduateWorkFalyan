import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:5000',
});

export const publicationsApi = {
    getArticles(data) {
        return instance.post(`/api/articles`, data, {"Content-Type": "application/json"})
                .then(res => res)
    }
}