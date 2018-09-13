// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  globals: {
    axios: true,
    _g: true,
    bus: true,
    moment: true,
    Lockr: true,
    Cookies: true,
    router: true,
    HOST: true,
    API_DOMAIN: true,
    BUILD_MODE: true,
    DEVICE_HOST: true,
    FK_HOST: true,
    OBD_HOST: true,
    // API_DOMAIN: true,
    R: true,
    _: true,
    AMapUI: true,
    AMap: true,
    escapeName: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: ['html'],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js',
      },
    },
  },
  // add your custom rules here
  rules: {
    "linebreak-style": [0 ,"error", "windows"],
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    'no-underscore-dangle': 'off',
    'no-new-func': 'off',
    'no-param-reassign': 'off',
    'react/prefer-stateless-function': 'off',
    'react/no-multi-comp': 'off',
    'react/jsx-no-bind': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-first-prop-new-line': 'off',
    'react/jsx-filename-extension': 'off',
    'no-restricted-syntax': 'off',
    // don't require .vue extension when importing
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        vue: 'never',
      },
    ],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': [
      'error',
      {
        optionalDependencies: ['test/unit/index.js'],
      },
    ],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  },
};
