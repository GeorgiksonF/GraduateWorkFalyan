<template>
    <div class="container">
        <div class="text-center spinner" v-if="preloader">
            <b-spinner label="Large Spinner"></b-spinner>
        </div>
        <div class="author" v-else>
            <h1 class="author__name">
                {{authorInfo.author}}
                <b-badge variant="dark">Rating: {{authorInfo.rating}}</b-badge>
            </h1>
            <div class="author__publications">
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
    </div>
</template>

<script>
import { authorsApi } from '../api/api'
export default {
    data() {
        return {
            authorInfo: {},
            preloader: false
        }
    },
    methods: {
        getUri(id) {
            return `/publications/id=${id}`
        },
        fetchAuthor() {
            this.preloader = true
            const dto = {
                authorId: this.$router.currentRoute.params.id
            }

            return authorsApi.getAuthorById(dto)
                    .then(res => {
                        this.authorInfo = res.data.author || {}
                        this.preloader = false
                    })
        }
    },
    mounted() {
        this.fetchAuthor()
    }
}
</script>

<style lang="scss">
    .spinner {
        margin-top: 100px;
    }
    .author {
        &__name {
            margin-top: 50px;
        }

        &__publications {
            margin-top: 40px;
        }

        &__articles {
            font-size: 23px;
        }
    }
</style>