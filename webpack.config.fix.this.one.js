// cannot get this one to work
const path = require('path');

module.exports = {
    //   entry: './lib/index.mjs', // builds dependency graph from this
    entry: './src/view.mts', // builds dependency graph from this
    module: {
        rules: [{

            use: 'ts-loader',
            exclude: '/node_modules/'
        }]
    },
    resolve: {
        extensions: ['.ts', 'mts', '.js']
    },
    mode: 'development', // could be production which minifies everything
    output: {
        filename: 'view.bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};