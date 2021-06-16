const { generateValidList, generateValidObject } = require('./eslint-utils');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'suggest the trigger property order',
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
      sortKeys: 'Expected trigger properties ordered like {{expectedOrder}} (\'{{beforeKey}}\' should be before \'{{nextKey}}\')',
    },
  },
  create: (context) => {
    const orderList = [
      'id',
      'disabled',
      'netRegex',
      'netRegexDe',
      'netRegexFr',
      'netRegexJa',
      'netRegexCn',
      'netRegexKo',
      'regex',
      'condition',
      'beforeSeconds',
      'condition',
      'preRun',
      'delaySeconds',
      'durationSeconds',
      'suppressSeconds',
      'promise',
      'sound',
      'soundVolume',
      'response',
      'alarmText',
      'alertText',
      'infoText',
      'tts',
      'run',
      'outputStrings',
    ];
    return {
      'Property[key.name=\'triggers\'] > ArrayExpression > ObjectExpression': (node) => {
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
