// vue.config.js
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // 注入文件的publicPath
  baseUrl: process.env.NODE_ENV === 'production' ? './' : '/',

  configureWebpack: {
    plugins: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_console: true
          }
        },
        // sourceMap: config.build.productionSourceMap,
        parallel: true
      })
    ],
    output: {
      libraryExport: 'default'
    },
    resolve: {
      alias: {
        'components': resolve('src/components')
      }
    }
  },
  css: {
    extract: false
  },
  productionSourceMap: false
}
