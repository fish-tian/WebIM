module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  // 解决跨域问题
  devServer: {
    proxy: {
      '^/auth': {
        target: 'http://localhost:3000',
        logLevel: "debug",
        changeOrigin: true
      },
    }
  }
}