'use strict';

const path = require('path');

// RULES_DIR must be absolute so that eslint can be used programmatically
// and still find the eslint/ plugin directory correctly.
const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = path.join(__dirname, 'eslint');

const dprintConfig = {
  'arrowFunction.useParentheses': 'force',
  'binaryExpression.linePerExpression': false,
  'binaryExpression.spaceSurroundingBitwiseAndArithmeticOperator': true,
  'commentLine.forceSpaceAfterSlashes': true,
  'constructor.spaceBeforeParentheses': false,
  'constructorType.spaceAfterNewKeyword': false,
  'constructSignature.spaceAfterNewKeyword': false,
  'doWhileStatement.spaceAfterWhileKeyword': true,
  'enumDeclaration.memberSpacing': 'maintain',
  'exportDeclaration.spaceSurroundingNamedExports': true,
  'forInStatement.spaceAfterForKeyword': true,
  'forOfStatement.spaceAfterForKeyword': true,
  'forStatement.spaceAfterForKeyword': true,
  'forStatement.spaceAfterSemiColons': true,
  'functionDeclaration.spaceBeforeParentheses': false,
  'functionExpression.spaceAfterFunctionKeyword': false,
  'functionExpression.spaceBeforeParentheses': false,
  'getAccessor.spaceBeforeParentheses': false,
  'ifStatement.spaceAfterIfKeyword': true,
  'ignoreFileCommentText': 'dprint-ignore-file',
  'ignoreNodeCommentText': 'dprint-ignore',
  'importDeclaration.spaceSurroundingNamedImports': true,
  'indentWidth': 2,
  'jsx.quoteStyle': 'preferDouble',
  'jsxExpressionContainer.spaceSurroundingExpression': false,
  'memberExpression.linePerExpression': false,
  'method.spaceBeforeParentheses': false,
  'newLineKind': 'crlf',
  'nextControlFlowPosition': 'maintain',
  'objectExpression.spaceSurroundingProperties': true,
  'objectPattern.spaceSurroundingProperties': true,
  'operatorPosition': 'maintain',
  'preferHanging': false,
  'preferSingleLine': false,
  'quoteStyle': 'alwaysSingle',
  'semiColons': 'prefer',
  'setAccessor.spaceBeforeParentheses': false,
  'singleBodyPosition': 'maintain',
  'spaceSurroundingProperties': true,
  'taggedTemplate.spaceBeforeLiteral': true,
  'trailingCommas': 'onlyMultiLine',
  'typeAnnotation.spaceBeforeColon': false,
  'typeAssertion.spaceBeforeExpression': true,
  'typeLiteral.separatorKind': 'semiColon',
  'typeLiteral.spaceSurroundingProperties': true,
  'useBraces': 'maintain',
  'useTabs': false,
  'whileStatement.spaceAfterWhileKeyword': true,
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
    'ui/raidboss/emulator/data/CombatantJobSearch.ts',
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
  // Handled by dprint.
  'comma-dangle': 'off',
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
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_\\w+' }],
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],
    'func-style': ['error', 'expression', { 'allowArrowFunctions': true }],
    'import/order': [
      'error',
      { 'alphabetize': { 'caseInsensitive': true, 'order': 'asc' }, 'newlines-between': 'always' },
    ],
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
      'rulesdir/cactbot-triggerset-property-order': ['error', { 'module': 'raidboss' }],
    },
  },
  {
    'files': ['**/oopsyraidsy/data/**/*'],
    'rules': {
      'rulesdir/cactbot-trigger-property-order': ['error', { 'module': 'oopsyraidsy' }],
      'rulesdir/cactbot-triggerset-property-order': ['error', { 'module': 'oopsyraidsy' }],
    },
  },
];

module.exports = {
  ...settings,
  overrides,
  rules,
};
