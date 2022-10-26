'use strict';

const path = require('path');

// RULES_DIR must be absolute so that eslint can be used programmatically
// and still find the eslint/ plugin directory correctly.
const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = path.join(__dirname, 'eslint');

// lineWidth specified depending on file location.
const dprintConfig = {
  'bracePosition': 'maintain',
  'indentWidth': 2,
  'newLineKind': 'crlf',
  'nextControlFlowPosition': 'maintain',
  'operatorPosition': 'maintain',
  'quoteStyle': 'alwaysSingle',
  'useBraces': 'maintain',
};

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
    'bin/',
    'dist/',
    'docs/',
    'node_modules/',
    'plugin/',
    'publish/',
    'resources/lib/',
  ],
  'parserOptions': {
    'ecmaVersion': 2020,
    'sourceType': 'module',
  },
  'plugins': [
    'dprint',
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

const dprintRule = (width) => {
  return {
    'dprint/dprint': [
      'warn',
      {
        config: {
          ...dprintConfig,
          'lineWidth': width,
        },
      },
    ],
  };
};

// General rules for all files.
const rules = {
  ...dprintRule(100),
  'arrow-spacing': [
    'warn',
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
  // Handled by dprint.
  'comma-dangle': 'off',
  'curly': [
    'warn',
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
  'import/no-useless-path-segments': 'error',
  'import/no-webpack-loader-syntax': 'error',
  // Handled by dprint.
  'indent': 'off',
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
  'no-duplicate-imports': 'warn',
  'no-else-return': 'warn',
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
    'warn',
    'always',
  ],
  'object-property-newline': [
    'error',
    {
      'allowAllPropertiesOnSameLine': true,
    },
  ],
  'no-extra-parens': ['error', 'all'],
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
    'warn',
    'never',
  ],
  'space-infix-ops': 'warn',
  'space-unary-ops': [
    'warn',
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
      'error',
      {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'never',
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': [
      'error',
      { 'allowHigherOrderFunctions': false },
    ],
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
    '@typescript-eslint/no-extra-parens': ['error'],
    '@typescript-eslint/no-invalid-this': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { 'args': 'all', 'argsIgnorePattern': '^_\\w?' }],
    '@typescript-eslint/object-curly-spacing': ['warn', 'always'],
    '@typescript-eslint/strict-boolean-expressions': ['error', {
      // @TODO: Remove these keys over time, setting them back to default
      'allowNullableBoolean': true,
      'allowNullableNumber': true,
      'allowNullableString': true,
    }],
    'func-style': ['error', 'expression', { 'allowArrowFunctions': true }],
    'import/order': [
      'error',
      { 'alphabetize': { 'caseInsensitive': true, 'order': 'asc' }, 'newlines-between': 'always' },
    ],
    'no-invalid-this': 'off',
    'no-extra-parens': 'off',
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
    'files': ['**/oopsyraidsy/data/**/*.ts', '**/raidboss/data/**/*.ts'],
    'rules': {
      ...dprintRule(300),
      // Raidboss data files always export a trigger set, and explicit types are noisy.
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // Only meant to be used for `output` parameters!
      '@typescript-eslint/no-non-null-assertion': 'off',
      'max-len': [
        'warn',
        {
          'code': 300,
        },
      ],
      'prefer-arrow/prefer-arrow-functions': 'warn',
      'rulesdir/cactbot-output-strings': 'error',
      'rulesdir/cactbot-response-default-severities': 'error',
      'rulesdir/cactbot-timeline-triggers': 'error',
    },
  },
  {
    // These are for the triggers branch only.
    'files': [
      '**/oopsyraidsy/data/**/*.js',
      '**/raidboss/data/**/*.js',
    ],
    'rules': {
      // This is a bit awkward, but see process_trigger_folders.ts.
      // It runs once without dprint using the indent rule, and then once with dprint.
      // dprint is VERY slow on unformatted files, but quick when there is nothing to do.
      // In general however, we don't want to specify both dprint and indent together,
      // as these rules fight against each other.
      ...dprintRule(300),
      'indent': [
        'warn',
        2,
        {
          'ignoreComments': false,
          'SwitchCase': 1,
        },
      ],
    },
  },
  {
    'files': ['**/raidboss/data/**/*'],
    'rules': {
      'rulesdir/cactbot-trigger-property-order': ['warn', { 'module': 'raidboss' }],
      'rulesdir/cactbot-triggerset-property-order': ['warn', { 'module': 'raidboss' }],
    },
  },
  {
    'files': ['**/oopsyraidsy/data/**/*'],
    'rules': {
      'rulesdir/cactbot-trigger-property-order': ['warn', { 'module': 'oopsyraidsy' }],
      'rulesdir/cactbot-triggerset-property-order': ['warn', { 'module': 'oopsyraidsy' }],
    },
  },
];

module.exports = {
  ...settings,
  overrides,
  rules,
};
