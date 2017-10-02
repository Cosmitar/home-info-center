const path = require('path');
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      __VERSION: JSON.stringify(require("./../package.json").version)
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"],
        include: path.resolve(__dirname, '../'),
        exclude: path.resolve(__dirname, '../node_modules')
      }, {
        test: /\.css$/,
        loaders: [
          require.resolve('style-loader'),
          require.resolve('css-loader')
        ],
        include: path.resolve(__dirname, '../')
      }
    ]
  }
}
