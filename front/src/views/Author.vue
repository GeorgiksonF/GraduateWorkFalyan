<template>
    <div class="container">
        <div class="author">
            <h1 class="author__name">{{authorInfo.author}}</h1>
            <p class="author__info">
                Рейтинг данного автора:
                <span class="author_rating">{{authorInfo.rating}}</span>
            </p>
            <h2>Публикации автора:</h2>
            <ul class="author__articles">
                <li v-for="article in authorInfo.articles" :key="article.id">
                    <b-link :to="getUri(article._id)">
                        {{article.title}}
                    </b-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { authorsApi } from '../api/api'
export default {
    data() {
        return {
            authorInfo: {}
        }
    },
    methods: {
        getUri(id) {
            return `/publications/id=${id}`
        },
        fetchAuthor() {
            const dto = {
                authorId: this.$router.currentRoute.params.id
            }

            return authorsApi.getAuthorById(dto)
                    .then(res => {
                        this.authorInfo = res.data.author || {}
                    })
        }
    },
    mounted() {
        this.fetchAuthor()
    }
}
</script>