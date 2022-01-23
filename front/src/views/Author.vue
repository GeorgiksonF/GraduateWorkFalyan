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
            <div class="author__rating">
                <h2>Author rating changing:</h2>
                <ul class="author__rating-list" v-for="item, i in ratingByYear" :key="i">
                    <li class="author__rating-item">
                        <span class="author__rating-item-key">{{item.year}}</span>: {{item.rating}}
                    </li>
                </ul>
            </div>
            <div class="author__publications">
                <h2>Author's publications:</h2>
                <ol class="author__articles">
                    <li v-for="article in authorInfo.articles" :key="article.id">
                        <b-link :to="getUri(article._id)">
                            {{article.title}}
                            <b-badge variant="dark">Article rating: {{article.rating}}</b-badge>
                        </b-link>
                        <p>Journal: {{article.journal.title}}</p>
                    </li>
                </ol>
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
            ratingByYear: [],
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
                        this.ratingByYear = res.data.ratingByYear || []
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
        &__rating {
            display: flex;
            flex-direction: column;
            &-list {
                display: flex;
                flex-direction: column;
                list-style-type: none;
                padding: 16px 0;
                padding: 0;
            }
            &-item {
                font-size: 25px;
                &-key {
                    font-weight: bold;
                }
            }
        }
    }
</style>