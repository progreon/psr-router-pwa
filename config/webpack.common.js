const webpack = require('webpack');
const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    polyfills: './src/polyfills.js',
    index: './src/main.js'
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      // cacheGroups: {
      //   vendor: {
      //     test: /[\\/]node_modules[\\/]/,
      //     name: 'vendors',
      //     chunks: 'all'
      //   }
      // },
      chunks: 'all'
    },
    minimizer: [
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    // new webpack.HashedModuleIdsPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) {
        return chunk.name;
      } else {
        var a = [];
        chunk._modules.forEach(m => a.push(path.relative(m.context, m.request)));
        return a.join("_");
      }
    }),
    { // TODO: name-all-modules-plugin?
      apply(compiler) {
        compiler.plugin("compilation", (compilation) => {
          compilation.plugin("before-module-ids", (modules) => {
            modules.forEach((module) => {
              if (module.id !== null) {
                return;
              }
              module.id = module.identifier();
            });
          });
        });
      }
    },
    new CleanWebpackPlugin(['dist'], { root: path.resolve(__dirname, '../') }),
    new HtmlWebpackPlugin({
      // title: 'CO-Pilot - PWA',
      template: path.resolve(__dirname, '../src/index.html')
    }),
    new ManifestPlugin(),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  output: {
    filename: '[name].[chunkhash].bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  resolve: {
    alias: {
      Components: path.resolve(__dirname, '../src/components/')
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader'
        ]
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader'
        ]
      }
    ],
    noParse: function(content) {
      return /webcomponents/.test(content);
    }
  }
};
