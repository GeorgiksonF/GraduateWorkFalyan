<template>
    <div class="container">
        <div class="article">
            <h1 class="article__title">{{articleInfo.title}}</h1>
            <p class="article__abstract">{{articleInfo.abstract}}</p>
            <ul class="article__info">
                
            </ul>
        </div>
    </div>
</template>

<script>
import { publicationsApi } from '../api/api'
export default {
    data() {
        return {
            articleInfo: {}
        }
    },
    methods: {
        fetchArticle() {
            const dto = {
                articleId: this.$router.currentRoute.params.id
            }

            return publicationsApi.getArticleBuId(dto)
                    .then(res => {
                        this.articleInfo = res.data.article || {}
                    })
        }
    },
    mounted() {
        this.fetchArticle()
    }
}
</script>