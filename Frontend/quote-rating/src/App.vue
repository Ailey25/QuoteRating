<template>
  <div id="app">
    <RandomQuote />
  </div>
</template>

<script>
import RandomQuote from './components/RandomQuote.vue'

export default {
  name: 'App',
  components: {
    RandomQuote
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
