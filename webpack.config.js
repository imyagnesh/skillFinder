var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'eval-source-map',

	// We add an entry to connect to the hot loading middleware from
	// the page
	entry: [
		'webpack-hot-middleware/client?reload=true',
		path.join(__dirname, 'app/main')
	],
	output: {
		path: path.join(__dirname, '/dist/'),
		filename: '[name].js',
		publicPath: '/'
	},

	// This plugin activates hot loading
	plugins: [
		new HtmlWebpackPlugin({
			template: 'app/index.html',
			inject: 'body',
			filename: 'index.html'
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development')
		})
	],
	module: {
		preLoaders: [
			{ test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/ }
		],
		loaders: [
			{
				test: /\.js?$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					"presets": ["es2015", "stage-0"]
				}
			},
			{
				test: /\.json?$/,
				loader: 'json'
			},
			{
				test: /\.css$/,
				exclude: /node-modules/,
				loader: 'style-loader!css-loader!autoprefixer-loader'
			},
			{
				test: /\.scss$/,
				exclude: /node-modules/,
				loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'
			},
			{
				test: /\.less$/,
				exclude: /node-modules/,
				loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'
			},
			{
				test: /\.(png|jpg|ttf|eot)$/,
				exclude: /node-modules/,
				loader: 'url-loader?limit=10000'
			},
			{
				test: /\.html$/,
				exclude: /node-modules/,
				loader: 'raw-loader'
			},
			{test: /\.svg/, loader: 'file?name=icons/[name].[ext]'},
			{
				test: [/fontawesome-webfont\.svg/, /fontawesome-webfont\.eot/, /fontawesome-webfont\.ttf/, /fontawesome-webfont\.woff/, /fontawesome-webfont\.woff2/],
				loader: 'file?name=fonts/[name].[ext]'
			}
		]
	},
	resolve: {
		extensions: ['', '.js']
	},
	eslint: {
		configFile: path.join(__dirname, '.eslintrc'),
		failOnWarning: false,
        failOnError: true
	}
}