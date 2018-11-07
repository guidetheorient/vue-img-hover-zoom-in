const helpers = {
  /**
   * 判断图片是否加载成功
   * @param {DOM element} img
   * @returns {Boolean}
   */
  isImgLoaded (img) {
    // complete不能判断图片加载成功或失败，加载失败naturalHeight有时也不为0；
    return img && img.complete && img.naturalHeight > 10
  }
}

export default helpers
