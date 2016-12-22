const webpack = require('webpack');
const path = require('path');
const env = process.env.NODE_ENV;

let config = {
  context: path.join(__dirname, 'src'),
  output: {
    library: 'Markademic',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.ts', '.tsx'],
    modules: [
      path.resolve('./src'),
      'node_modules'
    ]
  },
  module: {
    loaders: [
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

  externals: [
    {
      'highlight.js': {
        root: 'highlight.js',
        commonjs2: 'highlight.js',
        commonjs: 'highlight.js',
        amd: 'highlight.js'
      },
      'remarkable': {
        root: 'remarkable',
        commonjs2: 'remarkable',
        commonjs: 'remarkable',
        amd: 'remarkable'
      },
      'katex': {
        root: 'katex',
        commonjs2: 'katex',
        commonjs: 'katex',
        amd: 'katex'
      }
    }
  ],

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]

}

module.exports = config;