<template>
  <div id="app">
    <div class="header">Vue Img Hover Zoomin</div>
    <p class="desc">description: move the mouse and hover on images below, you can see the effect of this plugin</p>

    <router-link class="router-link-btn" :to="{path: '/body-scroll'}">
      BodyScroll
    </router-link>
    <router-link class="router-link-btn" :to="{path: '/element-scroll'}">
      otherElementScroll
    </router-link>

    <hr style="margin-top: 20px;">

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import './App.scss';
</style>
