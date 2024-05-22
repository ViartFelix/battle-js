const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    static: {
      directory: path.join(__dirname, 'public'),
    }
  },
});
