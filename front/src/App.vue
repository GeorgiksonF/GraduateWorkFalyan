<template>
  <div id="app">
    <Navbar/>
    <router-view>
      <Main/>
      <Publications/>
    </router-view>
  </div>
</template>

<script>
import store from './store/store'
import Navbar from './view/Navbar'
import Main from './view/Main'
import Publications from './view/Publications'
export default {
  name: 'App',
  store,
  components: {
    Navbar,
    Main,
    Publications
  }
}
</script>

<style lang="scss">
</style>