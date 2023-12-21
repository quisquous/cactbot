module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'prevent syntax issues within timelineTriggers',
      category: 'Syntax Issues',
      recommended: true,
      url:
        'https://github.com/OverlayPlugin/cactbot/blob/main/docs/RaidbossGuide.md#trigger-elements',
    },
    schema: [],
  },

  create: (context) => {
    return {
      'Property[key.name=\'timelineTriggers\'] > ArrayExpression > ObjectExpression > Property[key.name=\'regex\'] > :not(Identifier, Literal)':
        (node) =>
          context.report({
            node,
            message:
              'timelineTrigger regex has to be a regular expression literal, such as /^Ability Name$/',
          }),
      'Property[key.name=\'timelineTriggers\'] > ArrayExpression > ObjectExpression > Property[key.name=/(?:netRegex.{0,2}|regex.{2})/]':
        (node) =>
          context.report({
            node,
            message: 'timelineTriggers only support "regex"',
          }),
    };
  },
};
