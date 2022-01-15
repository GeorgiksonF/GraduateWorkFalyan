import Vue from 'vue'
import VueRouter from 'vue-router'
import Publications from '../view/Publications'
import Publication from '../view/Publication'
import Main from '../view/Main'

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
    path: '/publications/:id',
    name: '/Publication',
    component: Publication
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
