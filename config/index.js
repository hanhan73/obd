// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path');

const apiDomainMapping = {
  local: 'http://192.168.1.170:8001',
  test: 'http://cowtest.dtmobi.com:8001',
  prod: 'http://gps.dtmobi.com:8080',
};
const BUILD_MODE = process.argv[2] || 'test';
process.env.BUILD_MODE = BUILD_MODE;

const devApiDomain = 'http://192.168.1.170:8001';
// const devApiDomain = 'http://cowtest.dtmobi.com:8001';
// const devApiDomain = 'http://192.168.1.14:8001';
const buildApiDomain = apiDomainMapping[BUILD_MODE];

console.log(buildApiDomain);

module.exports = {
  build: {
    apiDomain: buildApiDomain,
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
  },
  dev: {
    apiDomain: devApiDomain,
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/new-gps-web/api': {
      //   target: 'http://192.168.1.14:8080/new-gps-web/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/new-gps-web/api': '',
      //   },
      // },
      '/obd/api': {
        target: `${devApiDomain}/obd/`,
        changeOrigin: true,
        pathRewrite: {
          '^/obd/api': '',
        },
      },
      // '/new--web/api': {
      //   target: `http://zy.dtmobi.com:8080/new-gps-web/`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/new-gps-web/api': '',
      //   },
      // },
      // '/zy-gps/api': {
      //   target: 'http://120.78.82.60:8501/zy-gps/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/zy-gps/api': '',
      //   },
      // },
      // '/zy-credit-app/api': {
      //   // target: 'https://zhxapps.dtmobi.com:8443/zy-credit-app/',
      //   target: 'http://120.79.5.45:8092/zy-credit-app/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/zy-credit-app/api': '',
      //   },
      // },
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },
};
