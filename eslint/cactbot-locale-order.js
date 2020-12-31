const defaultOrderList = [
  'en',
  'de',
  'fr',
  'ja',
  'cn',
  'ko',
];

let orderList = [];

function compareOrder(a, b) {
  const orderA = orderList.indexOf(a);
  const orderB = orderList.indexOf(b);

  // All keys are known to be in `orderList` by the `isLocaleObject` check below.
  return orderA - orderB;
}

function generateValidObject(props, sourceCode) {
  const sortedPropsText = [...props]
    .sort((a, b) => compareOrder(a.key.name, b.key.name))
    .map((prop) => ' '.repeat(prop.loc.start.column) + sourceCode.getText(prop))
    .join(',\n');
  return `{\n${sortedPropsText},\n${' '.repeat(props[0].loc.start.column - 2)}}`;
}

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
      url: 'https://github.com/quisquous/cactbot/blob/main/docs/RaidbossGuide.md#trigger-elements',
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
      sortKeys: 'Expected locale object keys ordered like {{expectedOrder}} (\'{{beforeKey}}\' should be before \'{{nextKey}}\')',
    },
  },
  create: function(context) {
    // fill orderList with option,
    // otherwise use the default one.
    orderList = context.options[0] || defaultOrderList;

    return {
      ObjectExpression(node) {
        const properties = node.properties;

        const isLocaleObject = properties.every((prop) => {
          return prop.key && orderList.includes(prop.key.name);
        });
        if (!isLocaleObject)
          return;

        const validList = [];

        for (let i = 1; i < properties.length; i++) {
          if (compareOrder(properties[i - 1].key.name, properties[i].key.name) > 0) {
            validList.push({
              nextKey: properties[i - 1].key.name,
              beforeKey: properties[i].key.name,
            });
          }
        }

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
              fix: (fixer) =>
                fixer.replaceTextRange(node.range, generateValidObject(properties, sourceCode)),
            });
          });
        }
      },
    };
  },
};

module.exports = ruleModule;
