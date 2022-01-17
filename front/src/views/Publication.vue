<template>
    <div class="container">
        <div class="text-center spinner" v-if="preloader">
            <b-spinner label="Large Spinner"></b-spinner>
        </div>
        <div class="article" v-else>
            <h1 class="article__title">
                {{articleInfo.title}}
                <b-badge variant="dark">Rating: {{articleInfo.rating}}</b-badge>
            </h1>
            <p class="article__abstract">{{articleInfo.abstract}}</p>
            <p class="article__journal">Journal: <span class="text-primary">{{articleInfo.journal.title}}</span></p>
            <b-row>
                <b-col>
                    <h2 class="article__authors-list">Authors list</h2>
                    <ul class="article__authors">
                        <li 
                            class="article__author"
                            v-for="item in articleInfo.authors"
                            :key="item._id">
                            <b-link :to="getUri(item._id)">{{item.author}}</b-link>
                        </li>
                    </ul>
                </b-col>
                <b-col>
                    <div class="article__info">
                        <h2 class="article__info-title">Article info</h2>
                        <table class="table article__table">
                            <tbody>
                                <tr>
                                    <th>Rating</th>
                                    <td>{{articleInfo.rating || null}}</td>
                                </tr>
                                <tr>
                                    <th>Published</th>
                                    <td>{{articleInfo.published || '-'}}</td>
                                </tr>
                                <tr>
                                    <th>DOI</th>
                                    <td>{{articleInfo.doi || '-'}}</td>
                                </tr>
                                <tr>
                                    <th>ISSUE</th>
                                    <td>{{articleInfo.issue || null}}</td>
                                </tr>
                                <tr>
                                    <th>Valume</th>
                                    <td>{{articleInfo.volume || '-'}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
import { publicationsApi } from '../api/api'
export default {
    data() {
        return {
            articleInfo: {
                journal: {}
            },
            preloader: false
        }
    },
    methods: {
        getUri(id) {
            return `/authors/id=${id}`
        },
        fetchArticle() {
            this.preloader = true
            const dto = {
                articleId: this.$router.currentRoute.params.id
            }

            return publicationsApi.getArticleBuId(dto)
                    .then(res => {
                        this.articleInfo = res.data.article || {}
                        this.preloader = false
                    })
        }
    },
    mounted() {
        this.fetchArticle()
    }
}
</script>

<style lang="scss">
    .spinner {
        margin-top: 100px;
    }

    .article {
        &__title {
            margin-top: 40px;
        }

        &__abstract {
            margin-top: 15px;
            font-size: 20px;
        }
        
        &__journal {
            font-size: 20px;
        }

        &__authors-list {
            margin-top: 20px;
        }

        &__authors {
            margin-top: 15px;
        }

        &__author {
            font-size: 20px;
        }

        &__info {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        &__table {
            font-size: 20px;
        }
    }
</style>