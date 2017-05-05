const path = require('path');
const config = Object.assign({}, require('./webpack.base'));

config.context = __dirname;

config.entry = './src/index.js';

config.output = {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'vue-tabs',
    libraryTarget: 'umd',
};

config.externals = {
    'vue': 'vue',
};

module.exports = config;