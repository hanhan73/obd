const path = require('path');
const webpack = require('webpack');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');

const DEV_API_DOMAIN = JSON.stringify(config.dev.apiDomain);
const PUB_API_DOMAIN = JSON.stringify(config.build.apiDomain);

const DEV_HOST = JSON.stringify('/obd/api');
const PUB_HOST = JSON.stringify('/obd/api');

const OBD_DEV_HOST = JSON.stringify('/obd/api');
const OBD_PUB_HOST = JSON.stringify('/obd/api');
// const PUB_HOST = JSON.stringify('http://zy.dtmobi.com:8080/new-gps-web');

const DEVICE_DEV_HOST = JSON.stringify('/zy-gps/api');
const DEVICE_PUB_HOST = JSON.stringify('/zy-gps/api');

const FK_DEV_HOST = JSON.stringify('/zy-credit-app/api');
const FK_PUB_HOST = JSON.stringify('/zy-credit-app/api');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  entry: {
    app: './src/main.js',
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath,
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      static: resolve('static'),
      assets: resolve('src/assets'),
      common: resolve('src/common'),
      components: resolve('src/components'),
      views: resolve('src/views'),
      store: resolve('src/store'),
      vendor: resolve('src/vendor'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      HOST: process.env.NODE_ENV === 'production' ? PUB_HOST : DEV_HOST,
      OBD_HOST: process.env.NODE_ENV === 'production' ? OBD_PUB_HOST : OBD_DEV_HOST,
      DEVICE_HOST: process.env.NODE_ENV === 'production' ? DEVICE_PUB_HOST : DEVICE_DEV_HOST,
      FK_HOST: process.env.NODE_ENV === 'production' ? FK_PUB_HOST : FK_DEV_HOST,
      API_DOMAIN: process.env.NODE_ENV === 'production' ? PUB_API_DOMAIN : DEV_API_DOMAIN,
      BUILD_MODE: JSON.stringify(process.env.BUILD_MODE),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // include: [resolve('src'), resolve('test')],
        include: [resolve('src'), resolve('test'), resolve('node_modules/vue-echarts')],
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]',
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      },
    ],
  },
};
