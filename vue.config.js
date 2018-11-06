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
        'components': resolve('src/components'),
        'base': resolve('src/components/base'),
        'common': resolve('src/common'),
        'api': resolve('src/api'),
        'views': resolve('src/views')
      }
    }
  },
  css: {
    extract: false
  },
  devServer: {
    proxy: {
      '/hb2/rest': {
        target: 'http://36.152.32.131:19080',
        // target: 'http://192.168.1.252:19080',
        changeOrigin: true,
        secure: false,
        autoRewrite: true
      },
      '/srv1': {
        target: 'http://36.152.32.131:19080',
        // target: 'http://192.168.1.252:19080',
        changeOrigin: true,
        secure: false
      }
    }
  },

  productionSourceMap: false
}
