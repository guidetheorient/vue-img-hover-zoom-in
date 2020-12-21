

# vue-img-hover-zoomin

> An Vue js plugin for PC that show an auto-enlarged image when hovering on it

:dash: Easy to use

:satisfied: For fun

V 0.3 Just Experimental

## Preview

![](./src/assets/preview.gif)

## Install

```bash
npm i -S vue-img-hover-zoom-in
```

## Usage

```js
import imgHoverZoomIn from 'vue-img-hover-zoom-in';

// all options are not necessary
Vue.use(imgHoverZoomIn, {
  // hoverd img offset from mouse
  offsetMouseX: 20,
  offsetMouseY: 20,
  // some high resolution img need to transform from the src of img elements
  imgSrcFormat(src) {
    let reg = /\.thb\.jpg$/;
    return reg.test(src) ? src.replace(reg, '') : src;
  }
});
```

```html
<!-- add directive to <img> -->
<!-- containerId is the border of the enlarged image and it is Id of an element，be sure it has definite width and height from the begining(not replaceable element changes its size)(default is window) -->
<img
  v-hover-zoom-img="{containerId: 'app'}"
  :src="..."
  :alt="..."
/>
```

| Name | Type | Default | Desc | 
|:-:|:-:|:-:|:-:|
|containerId| String \| window | window | 容器元素的 DOM id |
|dimension| Object\<Number\> | {left: 0, top: 0, right: 0, bottom: 0} | 1. containerId 与 dimension 二选一，优先使用 deimension  |

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

<span>Sample Photos by <a href="https://unsplash.com/@codypboard?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Cody Board</a> and <a href="https://unsplash.com/@justinlim?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Justin Lim</a> on <a href="https://unsplash.com/s/photos/husky?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>