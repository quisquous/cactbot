const orderMap = {
  en: 0,
  de: 1,
  fr: 2,
  ja: 3,
  cn: 4,
  ko: 5,
};


function isValidOrder(a, b) {
  const orderA = orderMap[a];
  const orderB = orderMap[b];

  if (orderA === undefined || orderB === undefined)
    return true;


  return orderA <= orderB;
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
    schema: [],
    messages: {
      sortKeys: 'Expected locale object keys to be in an order like [en, de, fr, ja, cn, ko]. \'{{thisName}}\' should be before \'{{prevName}}\'.',
    },
  },
  create: function(context) {
    let stack = null;
    return {
      ObjectExpression(node) {
        stack = {
          upper: stack,
          prev: null,
          prevName: null,
          numKeys: node.properties.length,
        };
      },

      'ObjectExpression:exit'() {
        stack = stack.upper;
      },
      Property(node) {
        if (node.parent.type === 'ObjectPattern')
          return;

        const prevName = stack.prevName;
        const prevNode = stack.prev;
        const thisName = node.key.name;

        if (thisName !== null) {
          stack.prevName = thisName;
          stack.prev = node;
        }

        if (prevName === null || thisName === null)
          return;

        if (!isValidOrder(prevName, thisName)) {
          const range = [prevNode.range[0], node.range[1]];

          const sourceCode = context.getSourceCode();
          const text = `${sourceCode.getText(node)},\n${' '.repeat(node.loc.start.column)}${sourceCode.getText(prevNode)}`;

          context.report({
            node,
            loc: node.key.loc,
            messageId: 'sortKeys',
            data: {
              thisName,
              prevName,
            },
            fix: (fixer) => fixer.replaceTextRange(range, text),
          });
        }
      },
    };
  },
};

module.exports = ruleModule;
