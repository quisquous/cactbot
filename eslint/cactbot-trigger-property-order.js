const { generateValidList, generateValidObject } = require('./eslint-utils');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'suggest the trigger property order',
      category: 'Stylistic Issues',
      recommended: true,
      url:
        'https://github.com/OverlayPlugin/cactbot/blob/main/docs/RaidbossGuide.md#trigger-elements',
    },
    fixable: 'code',
    schema: [
      {
        'type': 'object',
        'properties': {
          'module': {
            'enum': ['oopsyraidsy', 'raidboss'],
          },
        },
        'additionalProperties': false,
      },
    ],
    messages: {
      sortKeys:
        'Expected trigger properties ordered like {{expectedOrder}} (\'{{beforeKey}}\' should be before \'{{nextKey}}\')',
    },
  },
  create: (context) => {
    const raidbossOrderList = [
      'id',
      'comment',
      'type',
      'disabled',
      'netRegex',
      'netRegexDe',
      'netRegexFr',
      'netRegexJa',
      'netRegexCn',
      'netRegexKo',
      'regex',
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
    const oopsyraidsyOrderList = [
      'id',
      'comment',
      'netRegex',
      'netRegexDe',
      'netRegexFr',
      'netRegexJa',
      'netRegexCn',
      'netRegexKo',
      'regex',
      'damageRegex',
      'healRegex',
      'gainsEffectRegex',
      'losesEffectRegex',
      'abilityRegex',
      'condition',
      'delaySeconds',
      'suppressSeconds',
      'deathReason',
      'mistake',
      'run',
    ];
    const optionModule = context.options[0] ? context.options[0].module : undefined;
    if (!optionModule || optionModule !== 'oopsyraidsy' && optionModule !== 'raidboss')
      return;
    const orderList = optionModule === 'oopsyraidsy' ? oopsyraidsyOrderList : raidbossOrderList;
    return {
      'Property[key.name=/(timelineTriggers|triggers)/] > ArrayExpression > ObjectExpression': (
        node,
      ) => {
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
