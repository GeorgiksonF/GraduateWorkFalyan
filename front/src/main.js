import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import router from './router/index'
import { BootstrapVue } from 'bootstrap-vue'
import PortalVue from 'portal-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(PortalVue)
Vue.use(BootstrapVue)
Vue.use(Vuex)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
