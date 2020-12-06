module.exports = {
  root: true,
  extends: 'airbnb',
  env: {
    browser: true,
    node: true,
    es6: true,
    jquery: true,
  },
  parser: 'babel-eslint',
  plugins: ['react', 'babel'],
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 0 : 1,
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 1,
    'prefer-destructuring': 0,
    'no-else-return': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': [2, { ignore: ['^@/'] }],
    'react/jsx-props-no-spreading': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-indent': 0,
    'react/jsx-wrap-multilines': [
      'error',
      {
        declaration: false,
        assignment: false,
      },
    ],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-has-content': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'import/extensions': ['error', 'always', { 'js': 'never', 'jsx': 'never' }],
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'import/extensions': 0,
    'import/no-unresolved': 0
  },
};
