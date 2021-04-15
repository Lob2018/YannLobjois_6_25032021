const path = require('path');
module.exports = {
    mode: "production",
    entry: {
        polyfill: "babel-polyfill", // transpiler avec babel
        app: "./js/main.js" // point d'entrée de app (app nom de l'appli)
    },
    output: {
        filename: "[name].bundle.js", // bundler dans ./dist/app.bundle.js
        path: __dirname
    },
    module: {
        rules: [{
                test: /\.(sass|css|scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [
                                require("autoprefixer")()
                            ],
                        },
                    },
                    'sass-loader',
                ]
            },
            {
                test: /\.js$/, // tous les fichiers js
                exclude: /node_modules/, // sauf js de node modules
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            }
        ]
    }
};