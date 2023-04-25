const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
    devServer: {
        //请求服务器的地址
        proxy: 'http://localhost:8082'
    }
})
