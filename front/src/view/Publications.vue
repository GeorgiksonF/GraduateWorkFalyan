<template>
    <div class="container">
            <div>Sort by:</div>
            <b-form-select
                @change="changeSort"
                :options="sorting"
                class="w-75">
            </b-form-select>

            <div class="text-center" v-if="preloader">
                <b-spinner variant="primary" label="Spinning"></b-spinner>
            </div>
            <div v-else>
                <b-table
                    id="publications-table"
                    :items="items"
                    :fields="tableFields"
                    :current-page="page">
                    <template #cell(title)="data">
                        <b-link :to="getUri(data.item._id)">{{data.value}}</b-link>
                    </template>
                </b-table>
                <b-row class="justify-content-md-center">
                    <b-pagination
                        v-model="page"
                        :total-rows="totalCount"
                        :per-page="size"
                        aria-controls="publications-table">
                    </b-pagination>
                </b-row>
            </div>
    </div>
</template>

<script>
import { publicationsApi } from '../api/api'
export default {
    data() {
        return {
            size: 50,
            page: 1,
            totalCount: 0,
            searchText: '',
            preloader: false,
            sort: {
                field: 'title',
                order: 'asc'
            },
            items: [],
            tableFields: [
                'title',
                'published',
                'rating'
            ],
            sorting: [
                {value: {field: 'rating', order: 'desc'}, text: 'Descending rating'},
                {value: {field: 'rating', order: 'asc'}, text: 'Ascending rating'},
                {value: {field: 'title', order: 'asc'}, text: 'Title A -> Z'},
                {value: {field: 'title', order: 'desc'}, text: 'Title Z -> A'}
            ]
        }
    },
    methods: {
        getUri(id) {
            return `/publications/id=${id}`
        },
        changeSort(value) {
            this.sort = {
                field: value.field,
                order: value.order
            }
            this.fetchPublications()
        },
        fetchPublications() {
            this.preloader = true
            const dto = {
                page: this.page - 1 || 0,
                size: this.size || 50,
                search: this.searchText || '',
                sortField: this.sort.field || '',
                order: this.sort.order || ''
            }

            return publicationsApi.getArticles(dto)
                    .then(res => {
                        this.totalCount = res.data.total || 0
                        this.items = res.data.articles || []
                        this.preloader = false
                    })
        }
    },
    watch: {
        page() {
            this.fetchPublications()
        }
    },
    mounted() {
        this.fetchPublications()
    },
}
</script>

<style lang="scss">
    
</style>