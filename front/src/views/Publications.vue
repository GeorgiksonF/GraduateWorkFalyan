<template>
    <div class="container">
        <b-row sm="10" class="search">
            <b-form-input 
                id="input-small"
                class="w-75"
                v-model="searchText"
                placeholder="Search article"
                @keyup.enter="onSearch">
            </b-form-input>
            <b-button variant="primary" @click="onSearch" class="search__btn">Search</b-button>
            <b-button variant="danger" v-if="hasSearch" @click="onResetSearch" class="search__reset">Reset search</b-button>
        </b-row>

        <b-row class="filters">
            <span class="filters__desc">Sort by:</span>
            <b-form-select
                @change="changeSort"
                :options="sorting"
                class="w-25 filters__sort">
            </b-form-select>
        </b-row>

        <div>
            <b-table
                id="publications-table"
                :items="items"
                :fields="tableFields"
                :current-page="page"
                :busy="preloader"
                class="table">
                <template #cell(title)="data">
                    <b-link :to="getUri(data.item)">{{data.value}}</b-link>
                </template>
                <template #table-busy>
                    <div class="text-center text-grow my-2">
                        <b-spinner variant="grow" class="align-middle"></b-spinner>
                        <strong>Loading...</strong>
                    </div>
                </template>
            </b-table>

            <b-row class="justify-content-md-center">
                <b-pagination
                    v-if="!preloader && totalCount > size"
                    v-model="page"
                    :total-rows="totalCount"
                    :per-page="size"
                    class="pagination"
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
            hasSearch: false,
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
        getUri(item) {
            return {
                name: 'Publication',
                params: {id: item._id}
            }
        },
        changeSort(value) {
            this.sort = {
                field: value.field,
                order: value.order
            }
            this.fetchPublications()
        },
        onSearch() {
            if (this.searchText !== '') {
                this.hasSearch = true
                this.fetchPublications()
            }
        },
        onResetSearch() {
            this.hasSearch = false
            this.searchText = ''
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
    .search {
        align-items: center;
        margin-top: 20px;

        &__btn {
            margin-left: 20px;
        }

        &__reset { 
            margin-left: 20px;
        }
    }
    
    .filters {
        margin-top: 20px;
        align-items: center;

        &__desc {
            margin-right: 20px;
        }
    }
    .table {
        margin-top: 20px;
    }
</style>