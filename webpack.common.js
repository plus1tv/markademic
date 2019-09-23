const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	context: path.join(__dirname, 'src'),
	entry: {
		app: './markademic.ts'
	},
	plugins: [ new CleanWebpackPlugin() ],
	output: {
		filename: 'markademic.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'Markademic',
		libraryTarget: 'commonjs2'
	},
	resolve: {
		extensions: [ '.ts', '.tsx' ]
	},
	module: {
		rules: [
			{
				test: /\.ts/,
				exclude: /node_modules/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
					compilerOptions: {
						isolatedModules: true
					}
				}
			}
		]
	},
	node: {
		Buffer: false
	},
	externals: {
		'highlight.js': {
			root: 'highlight.js',
			commonjs2: 'highlight.js',
			commonjs: 'highlight.js',
			amd: 'highlight.js'
		},
		remarkable: {
			root: 'remarkable',
			commonjs2: 'remarkable',
			commonjs: 'remarkable',
			amd: 'remarkable'
		},
		katex: {
			root: 'katex',
			commonjs2: 'katex',
			commonjs: 'katex',
			amd: 'katex'
		}
	}
};
