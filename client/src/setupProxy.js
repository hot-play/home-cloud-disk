const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("../config/confugurate.options");
module.exports = (app) => {
    app.use(
        "/api",
        createProxyMiddleware({
            target: config.SERVER_PROXY,
            changeOrigin: true,
        })
    );
};
