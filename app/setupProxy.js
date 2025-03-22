// filepath: c:\Users\Mukilan T\Downloads\Projects\22becse057\src\setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/test',
    createProxyMiddleware({
      target: 'http://20.244.56.144',
      changeOrigin: true,
    })
  );
};