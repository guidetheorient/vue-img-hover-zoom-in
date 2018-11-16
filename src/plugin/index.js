/*
 * @Author: guidetheorient
 * @Date: 2018-05-17 09:26:15
 * @Last Modified by: guidetheorient
 * @Last Modified time: 2018-11-16 16:37:54
 */
import hoverImgComponent from './index.vue'

const hoverZoomImg = {
  install (Vue, options = {}) {
    let { offsetMouseX, offsetMouseY, delayShow, delayHide, imgSrcFormat, hasVueRouter } = options
    if (typeof offsetMouseX !== 'number' ||
      typeof offsetMouseX !== 'number') {
      offsetMouseX = offsetMouseY = 0
    }

    const HoverImgExtend = Vue.extend(hoverImgComponent)

    let instance
    if (!instance) {
      instance = new HoverImgExtend({
        el: document.createElement('div'),
        data: {
          offsetMouseX,
          offsetMouseY
        },
        // TODO: 这样合并？
        methods: {
          imgSrcFormat
        }
      })
      // console.log(instance, 'instance');
      document.querySelector('body').style.position = 'relative'
      document.querySelector('body').appendChild(instance.$el)
    }

    document.addEventListener('click', e => {
      Vue.nextTick(() => {
        !instance.canShow && instance.setCanShow(true)
      })
    })
    document.addEventListener('contextmenu', (e) => {
      instance.setCanShow(false)
    })
    document.addEventListener('mousemove', (e) => {
      instance && instance.setEvent(e)
    })

    if (hasVueRouter) {
      Vue.mixin({
        beforeRouteEnter (to, from, next) {
          !instance.canShow && instance.setCanShow(true)
          next()
        },
        beforeRouteLeave (to, from, next) {
          instance.canShow && instance.setCanShow(false)
          instance.show && instance.setShow(false)
          next()
        }
      })
    }

    Vue.directive('hover-zoom-img', {
      bind (el, binding) {
        let { containerId } = binding.value || {}
        instance.containerId = containerId
        el.addEventListener('mouseenter', (e) => {
          instance.setShow(true)
          instance.setEvent(e)
        })
        el.addEventListener('mouseleave', (e) => {
          instance.setShow(false)
        })
      },
      inserted () {
        // 每个元素都绑定了一遍，感觉哪里不对
        if (!hasVueRouter) {
          !instance.canShow && instance.setCanShow(true)
        }
      },
      unbind () {
        if (!hasVueRouter) {
          instance.canShow && instance.setCanShow(false)
          instance.show && instance.setShow(false)
        }
      }
    })
  }
}

export default hoverZoomImg
