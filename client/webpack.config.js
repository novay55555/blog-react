const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const cssExtractTextPlugin = new ExtractTextPlugin({ filename: '[contenthash].css', allChunks: true });
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

module.exports = {
  context: __dirname,
  entry: {
    app: './src/index.js',
    vendor: ['react', 'react-dom', 'react-router', 'redux', 'react-redux', 'babel-polyfill']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build/',
    filename: '[hash].js'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: [
        path.resolve(__dirname, 'node_modules')
      ],
      options: {
        presets: ['es2015', 'react', 'stage-2']
      }
    }, {
      test: /\.css$/,
      exclude: [
        path.resolve(__dirname, 'node_modules')
      ],
      use: cssExtractTextPlugin.extract({
        use: [{
          loader: 'css-loader',
          options: {
            modules: true,
            camelCase: true,
            localIdentName: '[name]-[local]',
            importLoaders: 1
          }
        },
          'postcss-loader'
        ]
      })
    }, {
      test: /\.css$/,
      include: [
        path.resolve(__dirname, 'node_modules', 'react-notifications')
      ],
      use: cssExtractTextPlugin.extract({
        use: [{
          loader: 'css-loader',
          options: {
            modules: true,
            camelCase: true,
            localIdentName: '[local]',
            importLoaders: 1
          }
        },
          'postcss-loader'
        ]
      })
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      use: 'file-loader?name=[name].[ext]'
    }]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      minify: false,
      template: './index.ejs',
      filename: path.join(__dirname, 'index.html')
    }),
    new HtmlWebpackHarddiskPlugin(),
    cssExtractTextPlugin
  ],
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000'
    },
    historyApiFallback: true
  }
};
