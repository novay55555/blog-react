const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const cssExtractTextPlugin = new ExtractTextPlugin({ filename: 'app.css', allChunks: true });

module.exports = {
	context: __dirname,
	entry: {
		app: './src/index.js',
		vendor: ['react', 'react-dom', 'react-router', 'redux', 'react-redux']
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		publicPath: '/build/',
		filename: 'bundle.js'
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
		cssExtractTextPlugin
	],
	devServer: {
		proxy: {
			'/api': 'http://localhost:3000'
		},
		historyApiFallback: true
	}
};
