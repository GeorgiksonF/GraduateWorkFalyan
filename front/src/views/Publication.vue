<template>
    <div class="container">
        <div class="article">
            <h1 class="article__title">{{article.title}}</h1>
            <p class="article__abstract">{{article.abstract}}</p>
            <ul class="article__info">
                li.article__info-item*
            </ul>
        </div>
    </div>
</template>

<script>
import { publicationsApi } from '../api/api'
export default {
    data() {
        return {
            journal: '',
            authorsList: []
        }
    },
    props: {
        article: Object
    },
    methods: {
        fetchArticleInfo() {
            const dto = {
                id: this.article._id || '',
                authorsIds: this.article.authors || [],
                journalId: this.article.journal || ''
            }
            return publicationsApi.getArticleInfo(dto)
                    .then(res => {
                        console.log(res)
                    })
        }
    },
    mounted() {
        // this.fetchArticleInfo()
    }
}
</script>