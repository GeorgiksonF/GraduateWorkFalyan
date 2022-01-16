import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main'
import Publications from '../views/Publications'
import Publication from '../views/Publication'
import Journals from '../views/Journals'
import Authors from '../views/Authors'
import Author from '../views/Author'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/publications',
    name: 'Publications',
    component: Publications
  },
  {
    path: '/publications/id=:id',
    name: 'Publication',
    component: Publication,
    props: true
  },
  {
    path: '/journals',
    name: 'Journals',
    component: Journals
  },
  {
    path: '/authors',
    name: 'Authors',
    component: Authors
  },
  {
    path: '/authors/id=:id',
    name: 'Author',
    component: Author,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
