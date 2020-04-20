const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/manager.ts',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot:true
  },
  output: {
    filename: 'output.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude:/node_modules/
      }
    ]
  },
  resolve: {
    extensions:['.tsx','.ts','.js']
  },
  output: {
    filename: 'output.js',
    path:path.resolve(__dirname,'dist')
  }
};