module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },

  configureWebpack: {
    devtool: "source-map",
    output: {
      filename: "[name].[hash].js"
    }
  },

  publicPath: "",

  pluginOptions: {
    cordovaPath: "cordova-src"
  }
};
