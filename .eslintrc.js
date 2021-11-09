const parseOptions = {
  ecmaVersion: '2020',
  ecmaFeatures: {
    //启用对实验性的objectRest/spreadProperties的支持
    experimentalObjectRestSpread: false,
    jsx: false,
  },
  sourceType: 'module',
}

const extendsConf = ['eslint:recommended', 'prettier']

const plugins = ['prettier']

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  //   parser: '@babel/eslint-parser',
  parseOptions,
  extends: extendsConf,
  plugins,
  rules: {
    'prettier/prettier': 'error',
  },
  settings: {},
}
