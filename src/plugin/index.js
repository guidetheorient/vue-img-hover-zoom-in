/*
 * @Author: guidetheorient
 * @Date: 2018-05-17 09:26:15
 * @Last Modified by: guidetheorient
 * @Last Modified time: 2020-12-21 15:24:37
 */
import HoverImgComponent from './index.vue'
import { DATA_HOVER_ZOOM } from './const'

const hoverZoomImg = {
  install (Vue, options = {}) {
    let { offsetMouseX, offsetMouseY, delayShow, delayHide, imgSrcFormat } = options
    if (typeof offsetMouseX !== 'number' ||
      typeof offsetMouseX !== 'number') {
      offsetMouseX = offsetMouseY = 0
    }

    const HoverImgExtend = Vue.extend(HoverImgComponent)

    let instance
    if (!instance) {
      instance = new HoverImgExtend({
        data: {
          offsetMouseX,
          offsetMouseY
        },
        // TODO: 这样合并？
        methods: {
          imgSrcFormat
        }
      }).$mount()
      document.querySelector('body').style.position = 'relative'
      document.querySelector('body').appendChild(instance.$el)
    }

    let contextmenuShow = false
    document.addEventListener('click', e => {
      if (contextmenuShow) {
        setTimeout(() => {
          contextmenuShow = false
          instance.setCanShow(true)
        }, 100)
      }
    })
    document.addEventListener('contextmenu', (e) => {
      contextmenuShow = true
      instance.setCanShow(false)
    })
    document.addEventListener('mousemove', (e) => {
      instance.setEvent(e)
    })

    Vue.mixin({
      beforeRouteLeave (to, from, next) {
        instance.imgSrc = null // 防止跳转页面显示上个页面跳转时出现的大图
        instance.containerId = null // 为了routerEnter时重新触发watch
        contextmenuShow ? next(false) : next()
      }
    })
    function onMouseEnter (e) {
      instance.setEvent(e)
      instance.setShow(true)
    }
    function onMouseLeave () {
      instance.setShow(false, true)
    }

    Vue.directive('hover-zoom-img', {
      bind (el, binding = {}) {
        let { containerId } = binding.value || {}
        instance.containerId = containerId
        el.setAttribute(DATA_HOVER_ZOOM, true)
      },
      inserted (el) {
        el.addEventListener('mouseenter', onMouseEnter)
        el.addEventListener('mouseleave', onMouseLeave)
      },
      unbind (el) {
        el.removeEventListener('mouseenter', onMouseEnter)
        el.removeEventListener('mouseleave', onMouseLeave)
        el.removeAttribute(DATA_HOVER_ZOOM)
        instance.show && instance.setShow(false)
      }
    })
  }
}

export default hoverZoomImg
