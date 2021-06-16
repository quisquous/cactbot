const { generateValidList, generateValidObject } = require('./eslint-utils');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'suggest the triggerSet property order',
      category: 'Stylistic Issues',
      recommended: true,
      url: 'https://github.com/quisquous/cactbot/blob/main/docs/RaidbossGuide.md#trigger-elements',
    },
    fixable: 'code',
    messages: {
      sortKeys: 'Expected triggerSet properties ordered like {{expectedOrder}} (\'{{beforeKey}}\' should be before \'{{nextKey}}\')',
    },
  },
  create: (context) => {
    const orderList = [
      'zoneId',
      'overrideTimelineFile',
      'timelineFile',
      'timeline',
      'resetWhenOutOfCombat',
      'initData',
      'timelineStyles',
      'timelineTriggers',
      'triggers',
      'timelineReplace',
    ];
    return {
      'VariableDeclarator[id.name=\'triggerSet\'] > ObjectExpression': (node) => {
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
                return fixer.replaceTextRange(
                    node.range,
                    generateValidObject(orderList, properties, sourceCode),
                );
              },
            });
          });
        }
      },
    };
  },
};
