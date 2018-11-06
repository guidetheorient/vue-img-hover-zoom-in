import Vue from 'vue'
import App from './App.vue'

import hoverZoomImg from './plugin/index.js'

Vue.config.productionTip = false
Vue.use(hoverZoomImg, {
  offsetMouseX: 20,
  offsetMouseY: 20,
  imgSrcFormat (src) {
    let reg = /\.thb\.jpg$/
    return reg.test(src) ? src.replace(reg, '') : src
  }
})

new Vue({
  render: h => h(App)
}).$mount('#app')
