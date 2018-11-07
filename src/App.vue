<template>
  <div id="app">
    <h1>hover on the image and mousemove, you can feel the function of this plugin</h1>
    <img alt="Vue logo" class="hover-img" v-hover-zoom-img  src="./assets/justin-lim-500765-unsplash .jpg">
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>

<style lang="scss">
html, body{
  margin: 0;
  padding: 0;
  height: 100%;
}
#app {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  img{
    width: 400px;
  }
}
</style>
