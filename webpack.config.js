const path = require('path');
const webpack = require('webpack');
const { ProvidePlugin } = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'src'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      "path": require.resolve("path-browserify")
    },
    alias: {
      'path': 'path-browserify'
    }
  },
  node: {
    __dirname: false,
    __filename: false,
    global: true
  },
  target: 'electron-renderer',
  externals: {
    path: 'path',
    jquery: 'jQuery'
  },
  plugins: [
    new ProvidePlugin({
      process: 'process/browser',
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.ProvidePlugin({
      highlightWithinTextarea: 'highlight-within-textarea'
    })
  ]
};
