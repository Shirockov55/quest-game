require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
    'plugin:playwright/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'vue/multi-word-component-names': 'off',
  },
};
