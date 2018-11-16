

# vue-img-hover-zoomin

> An Vue js plugin for PC that show an auto-enlarged image when hovering on it

:dash: Easy to use

:satisfied: For fun

V 0.2.0 Just Experimental

## Install

```bash
npm i -S vue-img-hover-zoom-in
```

## Usage

```js
import imgHoverZoomIn from 'vue-img-hover-zoom-in';

// all options are not necessary
// 选项中的属性都不是必须的
Vue.use(imgHoverZoomIn, {
  // it'd better set 'hasVueRouter' true if your project use vue-router
  // 项目使用了vue-router，最好加上此项
  hasVueRouter: true,
  // img offset from mouse
  // 为放大图离鼠标的x, y方向偏移距离
  offsetMouseX: 20,
  offsetMouseY: 20,
  // some img need to translate from the src of img elements
  // (the enlarged image need high resolution and the origin image src is low resolution)
  // imgSrcFormat为小图src转换成大图src的工具函数，没有可不传
  imgSrcFormat(src) {
    let reg = /\.thb\.jpg$/;
    return reg.test(src) ? src.replace(reg, '') : src;
  }
});
```

```html
<!-- add directive to <img> -->
<!-- class="hover-img" is necessary -->
<!-- 必须加上hover-img这个class，以便和不需要放大的进行区分 -->
<!-- containerId is the border of the enlarged image and it is Id of an element，be sure it has definite width and hegiht from begining(not replaceable element changes its size) -->
<!-- 边界容器的Id可不传，用来限制放大图所在区域的边界，默认为body，宽高固定，不会因为图片等可替换元素改变大小 -->
<img
  class="hover-img"
  :src="..."
  v-hover-zoom-img="{containerId: 'app'}"
  :alt="...">
```

## Development

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build-lib
```

## License

MIT
