<template>
    <div class="container">
            <b-row sm="10" class="search">
            <b-form-input 
                id="input-small"
                class="w-75"
                v-model="searchText"
                placeholder="Search author"
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
                <template #cell(author)="data">
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
import { authorsApi } from '../api/api'
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
                field: 'author',
                order: 'asc'
            },
            items: [],
            tableFields: [
                'author',
                'rating'
            ],
            sorting: [
                {value: {field: 'rating', order: 'desc'}, text: 'Descending rating'},
                {value: {field: 'rating', order: 'asc'}, text: 'Ascending rating'},
                {value: {field: 'author', order: 'asc'}, text: 'Author A -> Z'},
                {value: {field: 'author', order: 'desc'}, text: 'Author Z -> A'},
            ]
        }
    },
    methods: {
        getUri(item) {
            return {
                name: 'Author',
                params: {id: item._id}
            }
        },
        changeSort(value) {
            this.sort = {
                field: value.field,
                order: value.order
            }
            this.fetchAuthors()
        },
        onSearch() {
            if (this.searchText !== '') {
                this.hasSearch = true
                this.fetchAuthors()
            }
        },
        onResetSearch() {
            this.hasSearch = false
            this.searchText = ''
            this.fetchAuthors()
        },
        fetchAuthors() {
            this.preloader = true
            const dto = {
                page: this.page - 1 || 0,
                size: this.size || 50,
                search: this.searchText || '',
                sortField: this.sort.field || '',
                order: this.sort.order || ''
            }

            return authorsApi.getAuthors(dto)
                    .then(res => {
                        this.totalCount = res.data.total || 0
                        this.items = res.data.authors || []
                        this.preloader = false
                    })
        }
    },
    watch: {
        page() {
            this.fetchAuthors()
        }
    },
    mounted() {
        this.fetchAuthors()
    },
}
</script>