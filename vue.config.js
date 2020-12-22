// vue.config.js
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

  configureWebpack: {
    plugins: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        extractComments: true,
        // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        terserOptions: {
          compress: {
            drop_console: true
          },
          output: {
            beautify: false
          }
        }
      })
    ],
    output: {
      libraryExport: 'default'
    },
    resolve: {
      alias: {
        components: resolve('src/components')
      }
    }
  },
  css: {
    extract: false
  },
  productionSourceMap: false
}
