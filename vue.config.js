module.exports = {
    devServer: {
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
