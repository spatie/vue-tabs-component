module.exports = {
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loaders: ['vue'],
            },
            {
                test: /\.js/,
                loaders: ['babel-loader'],
                exclude: ['node_modules'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.vue'],
    },
};