const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./common.config.js');
const config = require('../app.config')(false);
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common(config), {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, '../..', config.outputDir),
  },
  // plugins: [
  //   new MiniCssExtractPlugin({
  //     filename: '[name].css',
  //     chunkFilename: '[id].css'
  //   })
  // ]
});
