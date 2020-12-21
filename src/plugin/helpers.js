const helpers = {
  getElementVisiblePositionInBrowser (el) {
    let scrollTop = 0
    const { top } = el.getBoundingClientRect()

    do {
      scrollTop += el.scrollTop
      el = el.offsetParent
    } while (el)

    return scrollTop + top
  },
  isWindow (para) {
    return para instanceof Window || para === window
  },
  /**
   * 判断图片是否加载成功
   * @param {DOM element} img
   * @returns {Boolean}
   */
  isImgLoaded (img) {
    // complete不能判断图片加载成功或失败，加载失败naturalHeight有时也不为0；
    return img && img.complete && img.naturalHeight > 10
  },
  // 节流
  throttle (fn, delay, interval) {
    let timer = null
    let prev = null
    return function () {
      let _this = this
      let args = arguments
      let now = +new Date()

      if (!prev) prev = now

      if (interval && (now - prev > interval)) {
        fn.apply(_this, args)
        prev = now
        clearTimeout(timer)
      } else {
        clearTimeout(timer)
        timer = setTimeout(function () {
          fn.apply(_this, args)
          prev = null
        }, delay)
      }
    }
  }
}

export default helpers
