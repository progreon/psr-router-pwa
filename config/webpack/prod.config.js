const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const common = require('./common.config.js');
const config = require('../app.config')(true);
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = merge(common(config), {
  mode: 'production',
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, '../..', config.outputDir)
  },
  plugins: [
    new UglifyJSPlugin({
      cache: true,
      parallel: true,
      sourceMap: true // set to true if you want JS source maps
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, '../../icon.png'),
      prefix: 'icons-[hash]/',
      emitStats: false,
      statsFilename: 'iconstats-[hash].json',
      persistentCache: true,
      inject: true,
      background: '#fafafa',
      title: config.app.name,
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: true,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new WebpackPwaManifest({
      name: config.app.name,
      // short_name: config.app.name,
      description: config.app.description,
      background_color: '#ffffff',
      start_url: '/',
      ios: true,
      icons: [
        {
          src: path.resolve(__dirname, '../../icon.png'),
          sizes: [96, 128, 192, 256, 384, 512, 1024],
          destination: 'icons/android'
        },
        {
          src: path.resolve(__dirname, '../../icon.png'),
          sizes: [96, 128, 192, 256, 384, 512, 1024],
          destination: 'icons/ios',
          ios: true
        },
        {
          src: path.resolve(__dirname, '../../icon.png'),
          sizes: [96, 128, 192, 256, 384, 512, 1024],
          destination: 'icons/ios',
          ios: 'startup'
        }
      ]
    })
  ],
  module: {
    rules: [
      ...config.app.transpile ? [{
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            'syntax-dynamic-import',
          ],
        }
      }] : [],
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
});
