const path = require('path')
const webpack = require('webpack')
const config = require('./config')

let plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new webpack.optimize.DedupePlugin(),
  // Webpack 1.0
  new webpack.optimize.OccurenceOrderPlugin(),
  // Webpack 2.0 fixed this mispelling
  // new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
]
let entry = ['./src/js/index.jsx']

if (process.env.NODE_ENV === 'development') {
  entry = entry.concat(['webpack-hot-middleware/client'])
}

if (process.env.NODE_ENV === 'production') {
  plugins = [new webpack.optimize.UglifyJsPlugin()]
    .concat(plugins)
}

module.exports = {
  context: __dirname,
  entry,
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: config.protocol + '://' + config.domain + ':' + config.port + '/dist/',
    filename: 'bundle.js'
  },
  plugins,
  module: {
    loaders: [{
      test: /\.js|\.jsx/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-0'],
        plugins: ['transform-decorators-legacy']
      }
    }]
  }
}