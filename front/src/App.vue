<template>
  <div id="app">
    <Navbar/>
    <router-view>
      <Main/>
      <Publications/>
      <Publication/>
      <Journals/>
      <Authors/>
      <Author/>
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
import Authors from './views/Authors'
import Author from './views/Author'

export default {
  name: 'App',
  store,
  components: {
    Navbar,
    Main,
    Publications,
    Publication,
    Journals,
    Authors,
    Author
  }
}
</script>