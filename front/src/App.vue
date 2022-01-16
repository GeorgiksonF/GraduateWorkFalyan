<template>
  <div id="app">
    <Navbar/>
    <router-view>
      <Main/>
      <Publications/>
      <Publication/>
      <Journals/>
    </router-view>
  </div>
</template>

<script>
import store from './store/store'
import Navbar from './views/Navbar'
import Main from './views/Main'
import Publications from './views/Publications'
import Publication from './views/Publication'
import Journals from './views/Journals'

export default {
  name: 'App',
  store,
  components: {
    Navbar,
    Main,
    Publications,
    Publication,
    Journals
  }
}
</script>

<style lang="scss">
</style>