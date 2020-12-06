const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const apiMocker = require('mocker-api');

const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
    mode: 'development',
    // 开发环境本地启动的服务配置
    devServer: {
        port: 7000,
        host: '0.0.0.0',
        hot: true,
        open: true,
        historyApiFallback: true,
        compress: true,
        before(app) {
            apiMocker(app, path.resolve('./mock/'), {
                changeHost: true,
            });
        },
        // 接口代理转发
        proxy: {
            // '/devApi/mm': {
            //   target: 'https://apis.map.qq.com',
            //   changeOrgin: true,
            //   pathRewrite: {
            //     '^/devApi/mm': '',
            //   },
            // },
            '/devApi': {
                // target: 'http://192.168.0.169:9501', // 本地测试
                target: 'https://test.bigtree-goods.com', // 本地测试
                // target: 'https://api.bigtree-goods.com', // 本地测试
                // target: 'http://47.108.151.32:9501', // 预发布地址http://47.108.151.32:9501
                // target: 'http://127.0.0.1:4523/mock/1266', // Mock Server
                // target: 'http://127.0.0.1:9502', // 本地
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/devApi': '',
                },
            },
        },
    },
    plugins: [new webpack.NamedModulesPlugin(), new webpack.HotModuleReplacementPlugin()],
    devtool: 'eval-source-map',
});