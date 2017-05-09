const path = require('path');
const config = Object.assign({}, require('../webpack.base'));

config.context = __dirname;

config.entry = './app.js';

config.output = {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
    publicPath: '/build/',
};

config.resolve.alias = {
    vue: 'vue/dist/vue.js',
};

config.devServer = {
    contentBase: __dirname,
    port: 2000,
};

module.exports = config;
