module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'eslint-plugin-import-helpers'
  ],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/camelcase": "off",
    "class-methods-use-this": "off",
    "@typescript-eslint/interface-name-prefix": ["error", { "prefixWithI": "always"}],
    "no-useless-constructor": "off",
    "no-useless-return": "off",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "_"
    }],
    "import/extensions": [
      "error",
      "ignorePackages",
      { "ts": "never" }
    ],
    'import-helpers/order-imports': [
      'warn',
      {
          newlinesBetween: 'always',
          groups: [
              'module',
              '/^@config/',
              '/^@shared/',
              '/^@modules/',
              ['parent', 'sibling', 'index'],
          ],
          alphabetize: { order: 'asc', ignoreCase: true },
      },
  ],
  },
  settings: {
    "import/resolver": {
      "typescript": {}
    }
  }
};
