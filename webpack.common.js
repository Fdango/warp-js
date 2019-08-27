const path = require('path');
const WrapperPlugin = require('wrapper-webpack-plugin');

module.exports = {
  entry: {
    'warp' : path.resolve(__dirname, 'src/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
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
      'Protos': path.resolve('./proto'),
      'ABIs': path.resolve('./abi')
    }
  },
  plugins: [
    new WrapperPlugin({
      test: /\.js$/,
      header: ('(function umdWrapper(root, factory) {' +
        '  if(typeof exports === "object" && typeof module === "object")' +
        '    module.exports = factory().default;' +
        '  else if(typeof define === "function" && define.amd)' +
        '    define("NAME", [], function() { return factory().default; });' +
        '  else if(typeof exports === "object")' +
        '    exports["NAME"] = factory().default;' +
        '  else' +
        '    root["NAME"] = factory().default;' +
        '})(this, function() {' +
        'return ').replace(/NAME/g, 'warp'),
      footer: '\n})',
    }),
  ],
}
