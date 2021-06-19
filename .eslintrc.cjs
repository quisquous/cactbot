'use strict';

const path = require('path');

// RULES_DIR must be absolute so that eslint can be used programmatically
// and still find the eslint/ plugin directory correctly.
const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = path.join(__dirname, 'eslint');

const settings = {
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': [
    'eslint:recommended',
    'google',
    'plugin:import/errors',
  ],
  'ignorePatterns': [
    // Do not ignore dot files.  /o\
    '!.*',
    '.git/',
    '.venv/',
    'dist/',
    'plugin/',
    'publish/',
    'resources/lib/',
    'ui/dps/rdmty/',
  ],
  'parserOptions': {
    'ecmaVersion': 2020,
    'sourceType': 'module',
  },
  'plugins': [
    'import',
    'rulesdir',
  ],
  'root': true,
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
};

// General rules for all files.
const rules = {
  'arrow-spacing': [
    'error',
    {
      'after': true,
      'before': true,
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
    'warn',
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
  'no-sequences': 'error',
  'no-undef': 'off',
  'no-unused-vars': 'off',
  'no-useless-escape': 'off',
  'nonblock-statement-body-position': ['error', 'below'],
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
  'prefer-regex-literals': 'error',
  'prefer-rest-params': 'off',
  'quotes': [
    'error',
    'single',
    {
      'allowTemplateLiterals': true,
    },
  ],
  'require-jsdoc': 'off',
  'rulesdir/cactbot-locale-order': [
    'warn',
    ['en', 'de', 'fr', 'ja', 'cn', 'ko'],
  ],
  'space-in-parens': [
    'error',
    'never',
  ],
  'space-infix-ops': 'error',
  'space-unary-ops': [
    'error',
    {
      'nonwords': false,
      'words': true,
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
};

// TypeScript rule overrides.
const tsOverrides = {
  'extends': [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  'files': ['*.ts'],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'project': ['./tsconfig.json'],
    'tsconfigRootDir': __dirname,
  },
  'plugins': ['@typescript-eslint', 'prefer-arrow'],
  'rules': {
    '@typescript-eslint/consistent-type-assertions': [
      'error', {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'never',
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': ['error', { 'allowHigherOrderFunctions': false }],
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
    '@typescript-eslint/method-signature-style': ['error', 'property'],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_\\w+' }],
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],
    'func-style': ['error', 'expression', { 'allowArrowFunctions': true }],
    'object-shorthand': ['error', 'consistent'],
  },
};

// Other overrides.
const overrides = [
  tsOverrides,
  {
    'files': ['*.cjs'],
    'parserOptions': {
      'sourceType': 'script',
    },
  },
  {
    'files': ['.eslintrc.cjs'],
    'rules': {
      'sort-keys': ['warn', 'asc', { caseSensitive: false, natural: true }],
    },
  },
  {
    'files': ['**/oopsyraidsy/data/**/*', '**/raidboss/data/**/*'],
    'rules': {
      // Raidboss data files always export a trigger set, and explicit types are noisy.
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // Only meant to be used for `output` parameters!
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-unused-vars': ['error', { 'args': 'all', 'argsIgnorePattern': '^_\\w+' }],
      'prefer-arrow/prefer-arrow-functions': 'warn',
      'rulesdir/cactbot-output-strings': 'error',
      'rulesdir/cactbot-response-default-severities': 'error',
      'rulesdir/cactbot-timeline-triggers': 'error',
    },
  },
  {
    'files': ['**/raidboss/data/**/*'],
    'rules': {
      'rulesdir/cactbot-trigger-property-order': ['error', { 'module': 'raidboss' }],
    },
  },
  {
    'files': ['**/oopsyraidsy/data/**/*'],
    'rules': {
      'rulesdir/cactbot-trigger-property-order': ['error', { 'module': 'oopsyraidsy' }],
    },
  },
  {
    'files': ['**/oopsyraidsy/data/**/*.ts', '**/raidboss/data/**/*.ts'],
    'rules': {
      'rulesdir/cactbot-matches-type-references': 'error',
    },
  },
];

module.exports = {
  ...settings,
  overrides,
  rules,
};
