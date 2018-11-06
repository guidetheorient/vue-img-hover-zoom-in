const helpers = {
  /**
   * 判断图片是否加载成功
   * @param {DOM element} img
   * @returns {Boolean}
   */
  isImgLoaded (img) {
    return img && img.complete && img.naturalHeight > 10
  }
}

export default helpers
