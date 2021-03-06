<template>
    <div class="container">
            <b-row sm="10" class="search">
            <b-form-input 
                id="input-small"
                class="w-75"
                v-model="searchText"
                placeholder="Search journal"
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
                <template #table-busy>
                    <div class="text-center text-grow my-2">
                        <b-spinner variant="grow" class="align-middle"></b-spinner>
                        <strong>Loading...</strong>
                    </div>
                </template>
                <template #cell(title)="data">
                    <div class="text-primary">
                        {{data.value}}
                    </div>
                </template>
                <template #cell(impact_factor)="data">
                    <div>
                        {{data.value || 0}}
                    </div>
                </template>
                <template #cell(issn)="data">
                    <div>
                        {{data.value || '-'}}
                    </div>
                </template>
                <template #cell(eissn)="data">
                    <div>
                        {{data.value || '-'}}
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
import { journalsApi } from '../api/api'
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
                'impact_factor',
                'issn',
                'eissn',
                'country'
            ],
            sorting: [
                {value: {field: 'impact_factor', order: 'desc'}, text: 'Descending impact factor'},
                {value: {field: 'impact_factor', order: 'asc'}, text: 'Ascending impact factor'},
                {value: {field: 'title', order: 'asc'}, text: 'Journal A -> Z'},
                {value: {field: 'title', order: 'desc'}, text: 'Journal Z -> A'},
                {value: {field: 'country', order: 'asc'}, text: 'Country A -> Z'},
                {value: {field: 'country', order: 'desc'}, text: 'Country Z -> A'}
            ]
        }
    },
    methods: {
        changeSort(value) {
            this.sort = {
                field: value.field,
                order: value.order
            }
            this.fetchJouranls()
        },
        onSearch() {
            if (this.searchText !== '') {
                this.hasSearch = true
                this.fetchJouranls()
            }
        },
        onResetSearch() {
            this.hasSearch = false
            this.searchText = ''
            this.fetchJouranls()
        },
        fetchJouranls() {
            this.preloader = true
            const dto = {
                page: this.page - 1 || 0,
                size: this.size || 50,
                search: this.searchText || '',
                sortField: this.sort.field || '',
                order: this.sort.order || ''
            }

            return journalsApi.getJournals(dto)
                    .then(res => {
                        this.totalCount = res.data.total || 0
                        this.items = res.data.journals || []
                        this.preloader = false
                    })
        }
    },
    watch: {
        page() {
            this.fetchJouranls()
        }
    },
    mounted() {
        this.fetchJouranls()
    },
}
</script>