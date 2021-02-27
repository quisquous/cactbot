'use strict';

const path = require('path');

// RULES_DIR must be absolute so that eslint can be used programatically
// and still find the eslint/ plugin directory correctly.
const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = path.join(__dirname, 'eslint');

module.exports = {
  'root': true,
  'parserOptions': {
    'ecmaVersion': 2020,
    'sourceType': 'module',
  },
  'overrides': [
    {
      'files': ['**/*.cjs'],
      'parserOptions': {
        'sourceType': 'script',
      },
    },
    {
      'files': ['**/*.ts'],
      'parser': '@typescript-eslint/parser',
      'plugins': ['@typescript-eslint'],
      'parserOptions': {
        'tsconfigRootDir': __dirname,
        'project': ['./tsconfig.json'],
      },
      'extends': [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      'rules': {
        '@typescript-eslint/no-non-null-assertion': 2,
        '@typescript-eslint/no-explicit-any': 2,
        '@typescript-eslint/member-delimiter-style': ['error', {
          'multiline': {
            'delimiter': 'semi',
            'requireLast': true,
          },
          'singleline': {
            'delimiter': 'semi',
            'requireLast': false,
          },
        }],
        'func-style': ['error', 'expression', { 'allowArrowFunctions': true }],
        'object-shorthand': ['error', 'consistent'],
        '@typescript-eslint/method-signature-style': ['error', 'property'],
        '@typescript-eslint/explicit-module-boundary-types': ['error', { 'allowHigherOrderFunctions': false }],
      },
    },
  ],
  'ignorePatterns': [
    'dist/',
    'plugin/',
    'publish/',
    'resources/lib/',
    'ui/dps/rdmty/',
  ],
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': [
    'eslint:recommended',
    'google',
    'plugin:import/errors',
  ],
  'plugins': [
    'import',
    'rulesdir',
  ],
  'settings': {
    'import/resolver': {
      'node': {
        'extensions': ['.d.ts', '.ts', '.js'],
      },
      'typescript': {
        'alwaysTryTypes': true,
        'project': './tsconfig.json',
      },
    },
  },
  'rules': {
    'arrow-spacing': [
      'error',
      {
        'before': true,
        'after': true,
      },
    ],
    'camelcase': [
      'error',
      {
        'properties': 'always',
      },
    ],
    'curly': [
      'error',
      'multi-or-nest',
      'consistent',
    ],
    'eqeqeq': 'error',
    'guard-for-in': 'off',
    'import/export': 'error',
    'import/no-duplicates': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'import/no-unresolved': [
      'error',
      {
        'caseSensitive': true,
      },
    ],
    'import/no-webpack-loader-syntax': 'error',
    'indent': [
      'error',
      2,
      {
        'ArrayExpression': 1,
        'CallExpression': {
          'arguments': 2,
        },
        'FunctionDeclaration': {
          'parameters': 2,
        },
        'FunctionExpression': {
          'parameters': 2,
        },
        'ignoreComments': false,
        'ObjectExpression': 1,
      },
    ],
    'linebreak-style': [
      'error',
      'windows',
    ],
    'max-len': [
      'error',
      {
        'code': 100,
        'ignoreRegExpLiterals': true,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
        'ignoreUrls': true,
        'tabWidth': 2,
      },
    ],
    'new-cap': [
      'error',
      {
        'capIsNew': false,
        'newIsCap': false,
        'properties': false,
      },
    ],
    'no-cond-assign': [
      'error',
      'always',
    ],
    'no-console': 'off',
    'no-duplicate-imports': 'error',
    'no-else-return': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-useless-escape': 'off',
    'object-curly-newline': [
      'error',
      {
        'consistent': true,
        'multiline': true,
      },
    ],
    'object-curly-spacing': [
      'error',
      'always',
    ],
    'object-property-newline': [
      'error',
      {
        'allowAllPropertiesOnSameLine': true,
      },
    ],
    'operator-linebreak': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-rest-params': 'off',
    'quotes': [
      'error',
      'single',
      {
        'allowTemplateLiterals': true,
      },
    ],
    'require-jsdoc': 'off',
    'space-in-parens': [
      'error',
      'never',
    ],
    'space-infix-ops': 'error',
    'space-unary-ops': [
      'error',
      {
        'words': true,
        'nonwords': false,
      },
    ],
    'strict': [
      'error',
      'global',
    ],
    'template-curly-spacing': 'error',
    'unicode-bom': [
      'error',
      'never',
    ],
    'valid-jsdoc': 'off',
    'rulesdir/cactbot-locale-order': [
      'warn',
      ['en', 'de', 'fr', 'ja', 'cn', 'ko'],
    ],
  },
};
