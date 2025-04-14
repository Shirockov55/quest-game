const vue = require('eslint-plugin-vue');
const playwright = require('eslint-plugin-playwright');

module.exports = [
  {
    files: ['**/*.vue', '**/*.ts', '**/*.js'],
    plugins: {
      vue: vue,
    },
    languageOptions: {
      parser: require('vue-eslint-parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        parser: require('@typescript-eslint/parser'),
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  playwright.configs['flat/recommended'],
];
