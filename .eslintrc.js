module.exports = {
  root: true,
  extends: '@react-native-community',
  ignorePatterns: ['dist/**', '__tests__/**'],
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'no-unused-expressions': 'warn',
    'max-len': ['error', {code: 100}],
    'no-shadow': 'off',
  },
};
