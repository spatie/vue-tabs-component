const path = require('path');
const merge = require('webpack-merge');

module.exports = merge(require('../webpack.base'), {
    context: __dirname,

    entry: './app.js',

    output: {
        path: path.resolve(__dirname, 'resources'),
        filename: 'app.js',
        publicPath: '/resources/',
    },

    resolve: {
        alias: {
            vue: 'vue/dist/vue.js',
        },
    },
});
