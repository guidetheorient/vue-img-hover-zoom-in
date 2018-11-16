<template>
  <div class="hover-zoom-img-wrapper" v-if="canShow && show && imgSrc && aspectRatio" :style="{transform: `translate(${imgL}, ${imgT})`}">
    <img class="hover-zoom-img" :src="imgSrc" :style="{width: imgW, height: imgH}">
  </div>
</template>

<script>
import helpers from './helpers'
import ResizeObserver from 'resize-observer-polyfill'

export default {
  data () {
    return {
      documentDims: {}, // document/body的尺寸信息

      containerId: '', // 放大图所在容器id
      containerEl: null, // 容器元素
      ctDims: {}, // 放大图所在容器尺寸对象

      offsetMouseX: 0, // 离鼠标距离x
      offsetMouseY: 0, // 离鼠标距离y

      e: null, // event对象
      show: false, // 是否显示
      canShow: false, // 是否允许显示
      // delayShow: .5, // 延迟显示
      // delayHide: .3, // 延迟隐藏

      imgEle: '', // 放大图的element元素
      imgSrc: '', // 放大图片的src

      // 最终位置
      imgW: '',
      imgH: '',
      imgL: '',
      imgT: '',

      hideTimer: null
    }
  },
  computed: {
    // 图片原始宽高比
    // aspectRatio会导致放大图暂时不不显示，但又不能忽视，因为放大图是重新请求的
    aspectRatio () {
      if (helpers.isImgLoaded(this.imgEle)) {
        return this.imgEle.naturalWidth / this.imgEle.naturalHeight
      }
    },
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
  methods: {
    _getImgSrc () {
      let imgSrc = ''
      if (this.e.target.tagName.toLowerCase() === 'img' &&
      this.e.target.classList.contains('hover-img')) {
        imgSrc = this.e.target.getAttribute('src')
      }
      imgSrc = this.imgSrcFormat(imgSrc) ? this.imgSrcFormat(imgSrc) : imgSrc
      this.imgSrc = imgSrc
    },
    _genImgEle () {
      if (this.imgSrc) {
        let img = new Image()
        img.src = this.imgSrc
        this.imgEle = img
        return
      }
      this.imgEle = null
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
    setShow (flag) {
      if (flag) {
        this.show = flag
      } else {
        clearTimeout(this.hideTimer)
        this.hideTimer = setTimeout(() => {
          if (!this.imgSrc) {
            this.show = flag
          }
        }, 200)
      }
    },
    // 获取document.body的尺寸信息
    _getDocumentDims () {
      let height = document.documentElement.clientHeight || document.body.clientHeight
      let width = document.documentElement.clientWidth || document.body.clientWidth
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
      // 传入了id选择器
      if (this.containerEl) {
        let dimension = this.containerEl.getBoundingClientRect()
        ctDims.borderLeft = dimension.left
        ctDims.borderRight = parseInt(this.documentDims.width - dimension.right)
        ctDims.borderTop = dimension.top
        ctDims.borderBottom = parseInt(this.documentDims.height - dimension.bottom)
        ctDims.width = dimension.width
        ctDims.height = dimension.height
      }
      // 默认为body
      else {
        ctDims.height = document.documentElement.clientHeight || document.body.clientHeight
        ctDims.width = document.documentElement.clientWidth || document.body.clientWidth
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
    // 监听容器元素的尺寸变化
    _observerContainer () {
      if (!this.containerEl) return
      this._destroyObserver()
      this.observer = new ResizeObserver((entries) => {
        this.throttleComputeContainerDimension()
      })
      this.observer.observe(this.containerEl)
    },
    // 销毁resizeObserver
    _destroyObserver () {
      if (!this.observer) return
      if (this.containerEl) {
        this.observer.unobserve(this.containerEl)
      }
      this.observer.disconnect()
      this.observer = null
    }
  },
  watch: {
    // 容器元素的id
    containerId (id) {
      this.containerEl = document.getElementById(id)
      if (!this.containerEl) return
      // 容器元素变化，重新计算容器尺寸
      this._computeContainerDimension()
      this._observerContainer()
    },
    e (val, oldVal) {
      if (!val || !this.canShow || !this.ctDims.width) return
      // 获取图片地址
      if (oldVal && val.target !== oldVal.target) {
        this._getImgSrc()
      }
      this._genImgEle()

      let eRelativePos = {
        x: this.e.pageX - this.ctDims.borderLeft,
        y: this.e.pageY - this.ctDims.borderTop
      }
      // 超过容器范围，不显示
      // 容器边界点还没有，不显示
      // 图片没有宽高比，不显示
      if (eRelativePos.x <= 0 ||
        eRelativePos.y <= 0 ||
        eRelativePos.x >= this.ctDims.width ||
        eRelativePos.y >= this.ctDims.height ||
        !this.ctBorderPoints.length ||
        !this.aspectRatio) {
        return
      }
      let { pointA, pointB } = this._getPoints(eRelativePos)
      // 图片最大可用宽高
      let imgMaxW = Math.abs(pointB.x - pointA.x)
      let imgMaxH = Math.abs(pointB.y - pointA.y)
      let { imgW, imgH } = this._getImgDims(imgMaxW, imgMaxH, this.aspectRatio)
      let { imgL, imgT } = this._getImgPos(imgW, imgH, eRelativePos, pointA)
      this.imgW = imgW + 'px'
      this.imgH = imgH + 'px'
      this.imgL = imgL + this.ctDims.borderLeft + 'px'
      this.imgT = imgT + this.ctDims.borderTop + 'px'
    }
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
  transition: all .2s;
  .hover-zoom-img {
    border: 5px solid #eee;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
