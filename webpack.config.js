const path = require('path');

module.exports = {
  context: path.resolve(__dirname, './src/'),
  mode: "production",
  entry: {
    app: './index.ts'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'color-assigner.js',
    library: 'ConvergenceColorAssigner',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ ".ts" ],
  },
  plugins: [],
  externals: {
  }
};
