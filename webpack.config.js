const path = require('path');

module.exports = {
    entry: './demo/app.js',

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [path.resolve(__dirname, 'node_modules')],
                loader: 'babel-loader',
            },
            {
                test: /\.vue$/,
                exclude: [path.resolve(__dirname, 'node_modules')],
                loaders: ['vue-loader'],
            },
        ],
    },

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        },
    },

    devServer: {
        publicPath: '/',
        contentBase: './demo',
    },
};