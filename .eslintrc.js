module.exports = {
  root: true,
  extends: '@react-native-community',
  ignorePatterns: ['dist/**', '__tests__/**'],
  rules: {
    'no-unused-expressions': 'warn',
    'max-len': ['error', {code: 100}],
    'no-shadow': 'off',
  },
};
