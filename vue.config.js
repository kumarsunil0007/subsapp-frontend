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
  },
  devServer: {
    port: 80,
    host: '0.0.0.0'
  }
};
