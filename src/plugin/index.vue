<template>
  <div
    v-show="canShow && show && imgSrc && aspectRatio"
    class="hover-zoom-img-wrapper"
    :style="{transform: `translate(${imgL}, ${imgT})`}"
  >
    <img class="hover-zoom-img" :src="imgSrc" :style="{width: imgW, height: imgH}">
  </div>
</template>

<script>
import ResizeObserver from 'resize-observer-polyfill'

import helpers from './helpers'

import { DATA_HOVER_ZOOM } from './const'

// DOM 各种尺寸含义 https://www.cnblogs.com/visugar/p/7247425.html
// 添加单元测试
// 1. 图片最终计算尺寸需要 1. 保持在浏览器视口中、2. 不能超出容器
export default {
  data () {
    return {
      documentDims: {}, // document/body的尺寸信息

      containerId: '', // 放大图所在容器id
      containerEl: null, // 容器元素
      ctDims: {}, // 放大图容器元素在浏览器可视区域的尺寸(容器元素于浏览器可视区域的交集)

      offsetMouseX: 0, // 离鼠标距离x
      offsetMouseY: 0, // 离鼠标距离y

      e: null, // event对象
      show: false, // 是否显示
      canShow: true, // 是否允许显示
      // delayShow: .5, // 延迟显示
      // delayHide: .3, // 延迟隐藏

      imgEle: null, // 放大图的element元素
      imgSrc: '', // 放大图片的src

      // 最终位置
      imgW: '',
      imgH: '',
      imgL: '',
      imgT: '',

      hideTimer: null,
      // 图片原始宽高比
      // aspectRatio会导致放大图暂时不不显示，但又不能忽视，因为放大图是重新请求的
      aspectRatio: null
    }
  },
  computed: {
    // 容器四个边界点坐标，顺序：顺时针
    ctBorderPoints () {
      let points = []
      if (Object.keys(this.ctDims)) {
        points = [
          { x: 0, y: 0 },
          { x: this.ctDims.width, y: 0 },
          { x: this.ctDims.width, y: this.ctDims.height },
          { x: 0, y: this.ctDims.height }
        ]
      }
      return points
    }
  },
  watch: {
    containerId (id) {
      this.containerEl = document.getElementById(id || null) || window
      // 容器元素变化，重新计算容器尺寸
      this._computeContainerDimension()
      this._observerContainer()
      this.prevContainerEl = this.containerEl
    },
    e (val, oldVal) {
      if (!val || !this.canShow || !this.ctDims.width) {
        this.imgSrc = null
        this.imgEle.src = ''
        this.aspectRatio = 0
        return
      };

      this._getImgSrc()
      this._genImgEle()

      const { e, ctDims } = this

      let eRelativePos = {
        x: e.clientX - ctDims.borderLeft,
        y: e.clientY - ctDims.borderTop
      }
      // 超过容器范围，不显示
      // 容器边界点还没有，不显示
      // 图片没有宽高比，不显示
      let calc = true
      if (eRelativePos.x <= 0 ||
        eRelativePos.y <= 0 ||
        eRelativePos.x >= ctDims.width ||
        eRelativePos.y >= ctDims.height ||
        !this.ctBorderPoints.length ||
        !this.aspectRatio) {
        calc = false
      }
      let { pointA, pointB } = this._getPoints(eRelativePos)

      let imgW = 0
      let imgH = 0

      if (calc) {
        let imgMaxW = Math.abs(pointB.x - pointA.x)
        let imgMaxH = Math.abs(pointB.y - pointA.y);
        ({ imgW, imgH } = this._getImgDims(imgMaxW, imgMaxH, this.aspectRatio))

        this.imgW = imgW + 'px'
        this.imgH = imgH + 'px'
      }

      let { imgL, imgT } = this._getImgPos(imgW, imgH, eRelativePos, pointA)
      this.imgL = imgL + ctDims.borderLeft + 'px'
      this.imgT = imgT + ctDims.borderTop + 'px'
    }
  },
  methods: {
    _getAspectRatio () {
      if (helpers.isImgLoaded(this.imgEle)) {
        this.aspectRatio = this.imgEle.naturalWidth / this.imgEle.naturalHeight
      }
    },
    _getImgSrc () {
      let imgSrc = ''
      const { target } = this.e || {}

      if (target.tagName.toLowerCase() === 'img' && target.hasAttribute(DATA_HOVER_ZOOM)) {
        imgSrc = target.getAttribute('src')
      }
      imgSrc = this.imgSrcFormat(imgSrc) ? this.imgSrcFormat(imgSrc) : imgSrc
      this.prevImgSrc = this.imgSrc
      this.imgSrc = imgSrc
    },
    _genImgEle () {
      if (this.imgSrc && this.prevImgSrc !== this.imgSrc) {
        this.aspectRatio = 0
        this.imgEle.src = this.imgSrc
      }
    },
    // 获取图片src默认function
    imgSrcFormat (src) {
      return src
    },
    // 设置event对象
    setEvent (e) {
      this.e = e
    },
    // 设置是否能显示；以下情况不可以显示 1.右键菜单
    setCanShow (flag) {
      this.canShow = flag
    },
    // ignoreImgSrc: 不管有无imgSrc都要置为false
    setShow (flag, ignoreImgSrc) {
      clearTimeout(this.hideTimer)
      this.hideTimer = null
      if (flag) {
        this.show = flag
      } else {
        // 使用timer，是因为多图片过渡，平滑些
        this.hideTimer = setTimeout(() => {
          if (ignoreImgSrc) {
            this.imgSrc = null
          }
          if (!this.imgSrc) {
            this.show = flag
          }
        }, 100)
      }
    },
    // 获取document.body的尺寸信息
    _getDocumentDims () {
      let height = window.innerHeight
      let width = window.innerWidth
      this.documentDims = { height, width }
    },
    // 计算放大图所在容器的边界尺寸信息
    _computeContainerDimension () {
      let ctDims = {
        borderLeft: 0,
        borderRight: 0,
        borderTop: 0,
        borderBottom: 0,
        width: 0,
        height: 0
      }

      if (this.containerEl instanceof Element) {
        let dimension = this.containerEl.getBoundingClientRect()
        ctDims.borderLeft = dimension.left
        ctDims.borderRight = parseInt(this.documentDims.width - dimension.right)
        ctDims.borderTop = dimension.top
        ctDims.borderBottom = parseInt(this.documentDims.height - dimension.bottom)
        ctDims.width = dimension.width
        ctDims.height = dimension.height
      } else {
        ctDims.height = document.documentElement.clientHeight || window.innerHeight
        ctDims.width = document.documentElement.clientWidth || window.innerWidth
      }
      this.ctDims = ctDims
    },
    // 获取图片显示位置的矩形对角点
    _getPoints (point) {
      let halfX = this.ctDims.width / 2
      let halfY = this.ctDims.height / 2
      let pointA, pointB
      if (halfX >= point.x && halfY >= point.y) {
        pointA = {
          x: point.x + this.offsetMouseX,
          y: point.y + this.offsetMouseY
        }
        pointB = this.ctBorderPoints[2]
      } else if (halfX < point.x && halfY >= point.y) {
        pointA = {
          x: point.x - this.offsetMouseX,
          y: point.y + this.offsetMouseY
        }
        pointB = this.ctBorderPoints[3]
      } else if (halfX < point.x && halfY < point.y) {
        pointA = {
          x: point.x - this.offsetMouseX,
          y: point.y - this.offsetMouseY
        }
        pointB = this.ctBorderPoints[0]
      } else if (halfX >= point.x && halfY < point.y) {
        pointA = {
          x: point.x + this.offsetMouseX,
          y: point.y - this.offsetMouseY
        }
        pointB = this.ctBorderPoints[1]
      }
      return { pointA, pointB }
    },
    // 获取图片实际宽高
    _getImgDims (width, height, aspectRatio) {
      if (width / height > aspectRatio) {
        width = height * aspectRatio
      } else {
        height = width / aspectRatio
      }
      return { imgW: width, imgH: height }
    },
    // 获取图片位置信息
    /**
     * @param {number} width 图片宽度
     * @param {number} height 图片高度
     * @param {Object: {x: number,y: number}} point 鼠标所在位置
     * @param {Object: {x: number,y: number}} pointA 鼠标经过偏移后的位置
     * */
    _getImgPos (width, height, point, pointA) {
      let halfX = this.ctDims.width / 2
      let halfY = this.ctDims.height / 2
      let imgL, imgT
      if (halfX > point.x && halfY > point.y) {
        imgL = pointA.x
        imgT = pointA.y
      } else if (halfX < point.x && halfY > point.y) {
        imgL = pointA.x - width
        imgT = pointA.y
      } else if (halfX < point.x && halfY < point.y) {
        imgL = pointA.x - width
        imgT = pointA.y - height
      } else if (halfX > point.x && halfY < point.y) {
        imgL = pointA.x
        imgT = pointA.y - height
      }
      return { imgL, imgT }
    },
    _observerContainer () {
      this._destroyObserver()
      let { containerEl } = this
      if (!containerEl) return
      containerEl = helpers.isWindow(containerEl) ? document.documentElement : containerEl

      this.observer = new ResizeObserver((entries) => {
        this.throttleComputeContainerDimension()
      })
      this.observer.observe(containerEl)
    },
    _destroyObserver () {
      if (!this.observer) return

      if (this.prevContainerEl) {
        let prevContainerEl = helpers.isWindow(this.prevContainerEl) ? document.documentElement : this.prevContainerEl
        this.observer.unobserve(prevContainerEl)
      }
      this.observer.disconnect()
      this.observer = null
    }
  },
  created () {
    this.aspectRatio = 0
    this.imgEle = new Image()
    this.imgEle.onload = () => { this._getAspectRatio() }
  },
  mounted () {
    this._getDocumentDims()

    if (!this.ctDims.width) {
      this._computeContainerDimension()
    }

    this.throttleComputeContainerDimension = helpers.throttle(this._computeContainerDimension, 200)
  },
  beforeDestroy () {
    clearTimeout(this.hideTimer)
    this.hideTimer = null
  }
}
</script>

<style lang="scss" scoped>
.hover-zoom-img-wrapper {
  pointer-events: none;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 3000;
  transition: all .1s;
  .hover-zoom-img {
    display: block;
    width: 0; height: 0;
    border: 5px solid #eee;
    box-sizing: border-box;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
