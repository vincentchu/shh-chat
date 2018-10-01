// @flow
/* eslint-disable import/no-nodejs-modules */
import path from 'path'
import webpack from 'webpack'

function resolve(glob: string) {
  return path.resolve(__dirname, '..', glob)
}

const plugins = [
  new webpack.LoaderOptionsPlugin({ debug: true }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
]

export default {
  target: 'web',
  bail: true,
  mode: 'development',
  node: { fs: 'empty' },
  entry: { main: resolve('./src/boot.js') },
  plugins,
  context: __dirname,
  output: {
    path: resolve('./build'),
    filename: '[name].js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [ resolve('src') ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: [ /node_modules/, /CryptoMarchMadness\.json/ ],
      },
    ],
  },

  devServer: {
    publicPath: '/',
    filename: 'bundle.js',
    historyApiFallback: true,
    hot: true,
    contentBase: './build',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
    stats: {
      cached: false,
      cachedAssets: false,
      colors: { level: 2, hasBasic: true, has256: true, has16m: false },
    },
    disableHostCheck: true,
  },
}