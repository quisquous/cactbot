const { generateValidList, generateValidObject } = require('./eslint-utils');

const defaultOrderList = [
  'en',
  'de',
  'fr',
  'ja',
  'cn',
  'ko',
];

let orderList = [];

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/**
 * @type Rule.RuleModule
 */
const ruleModule = {
  meta: {
    type: 'suggestion',

    docs: {
      description: 'suggest the locale object key order',
      category: 'Stylistic Issues',
      recommended: true,
      url:
        'https://github.com/OverlayPlugin/cactbot/blob/main/docs/RaidbossGuide.md#trigger-elements',
    },
    fixable: 'code',
    schema: [
      {
        'type': 'array',
        'items': {
          'type': 'string',
        },
      },
    ],
    messages: {
      sortKeys:
        'Expected locale object keys ordered like {{expectedOrder}} (\'{{beforeKey}}\' should be before \'{{nextKey}}\')',
    },
  },
  create: function(context) {
    // fill orderList with option,
    // otherwise use the default one.
    orderList = context.options[0] || defaultOrderList;

    return {
      ObjectExpression(node) {
        const properties = node.properties;

        const validList = generateValidList(orderList, properties);

        if (validList.length >= 1) {
          const sourceCode = context.getSourceCode();
          validList.forEach((valid) => {
            context.report({
              node,
              loc: node.loc,
              messageId: 'sortKeys',
              data: {
                expectedOrder: `[${orderList.join(',')}]`,
                beforeKey: valid.beforeKey,
                nextKey: valid.nextKey,
              },
              fix: (fixer) => {
                const replacementText = generateValidObject(orderList, properties, sourceCode);
                if (replacementText)
                  return fixer.replaceTextRange(node.range, replacementText);
              },
            });
          });
        }
      },
    };
  },
};

module.exports = ruleModule;
