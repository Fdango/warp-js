const path = require('path')

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    library: 'warp',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    filename: '[name].js',
  },
  node: { fs: 'empty' },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      ABIs: path.join('.', 'abi'),
    },
  },
}
