const playwright = require('eslint-plugin-playwright');

module.exports = [
  playwright.configs['flat/recommended'],
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {},
  },
];
