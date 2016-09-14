const webpack = require('webpack');
const env = process.env.NODE_ENV;

let config = {

  output: {
    library: 'Markademic',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
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
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]

}

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    })
  )
}

module.exports = config;