module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },

  configureWebpack: {
    devtool: "source-map"
  },

  publicPath: '',

  pluginOptions: {
    cordovaPath: 'cordova-src'
  }
};
