<template>
  <div class="element-scroll">
    <p>elementScroll</p>
    <p>scroll element is not body</p>

    <div class="main">
      <div>
        <img alt="Vue logo" v-hover-zoom-img  src="../assets/justin-lim-500765-unsplash.jpg">
        <img alt="Vue logo" v-hover-zoom-img  src="../assets/cody-board-tnNVJd_nrw8-unsplash.jpg">

        <div style="margin: 15px auto; padding: 20px 0; width: 500px; height: 1000px; background: #f8f8f8">
          long long long element
        </div>

        <img alt="Vue logo" v-hover-zoom-img  src="../assets/justin-lim-500765-unsplash.jpg">
        <img alt="Vue logo" v-hover-zoom-img  src="../assets/cody-board-tnNVJd_nrw8-unsplash.jpg">
      </div>
    </div>
  </div>
</template>

<script>

</script>

<style lang="scss" scoped>
.element-scroll{
  .main{
    height: 600px;
    overflow: auto;
  }
}
</style>
