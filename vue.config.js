const path = require('path');

module.exports = {
  css: {
    extract: false
  },
  configureWebpack: {
    // externals: ['com1', 'lodash'],
    // output: {
    //   libraryTarget: 'system'
    // },
    module: {
      rules: [
        {
          parser: {
            system: false
          }
        }
      ]
    }
  },
  devServer: {
    host: 'localhost',
    port: '8089',
    open: true,
    contentBase: path.resolve(__dirname, './'),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  // chainWebpack: config => {
  //   config
  //   .plugin('html')
  //   .tap(args => {
  //     return [{ inject: true }]
  //   })
  // }
}