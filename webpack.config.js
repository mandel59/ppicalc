const HtmlWebpackPlugin = require('html-webpack-plugin')
const InjectBodyPlugin = require('inject-body-webpack-plugin').default

module.exports = {
  // mode: 'development',
  mode: 'production',
  entry: './src/main.tsx',
  plugins: [
    new HtmlWebpackPlugin(),
    new InjectBodyPlugin({
      content: '<div id=approot></div>'
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: 'ts-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: [
      '.ts', '.tsx', '.js',
    ],
  },
};