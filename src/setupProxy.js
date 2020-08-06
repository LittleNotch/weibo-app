const { createProxyMiddleware} = require('http-proxy-middleware');


module.exports = function(app) {
    app.use(
        '/proxy',
        createProxyMiddleware({
            target: 'http://mock.don.red/weibo',
            pathRewrite: {'/proxy': '/'},
            changeOrigin: true,
        })
    )
}