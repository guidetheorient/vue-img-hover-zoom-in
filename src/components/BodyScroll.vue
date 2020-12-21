<template>
  <div class="body-scroll">
    <p>bodyScroll</p>
    <p>scroll element is body</p>

    <img class="hover-img" v-hover-zoom-img  src="../assets/justin-lim-500765-unsplash.jpg">
    <img class="hover-img" v-hover-zoom-img  src="../assets/cody-board-tnNVJd_nrw8-unsplash.jpg">

    <div style="margin: 15px auto; padding: 20px 0; width: 500px; height: 1000px; background: #f8f8f8">
      long long long element
    </div>

    <img class="hover-img" v-hover-zoom-img  src="../assets/justin-lim-500765-unsplash.jpg">
    <img class="hover-img" v-hover-zoom-img  src="../assets/cody-board-tnNVJd_nrw8-unsplash.jpg">

  </div>
</template>

<script>
export default {
  beforeRouteEnter (to, from, next) {
    document.documentElement.id = 'html-scroll'
    next()
  },
  beforeRouteLeave (to, from, next) {
    document.documentElement.id = ''
    setTimeout(() => {
      next()
    }, 20)
  }
}
</script>

<style lang="scss" scoped>
</style>
