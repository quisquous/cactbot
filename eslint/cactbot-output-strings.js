const t = require('@babel/types');
const textProps = ['alarmText', 'alertText', 'infoText', 'tts'];

/**
 * get all keys name from object literal expression
 * @param {(t.Property|t.SpreadElement)[]} props
 * @param {Map<string, (t.Property|t.SpreadElement)[]>} spreadNameMaps
 * @return {string[]}
 */
const getAllKeys = (props, spreadNameMaps) => {
  const propKeys = [];

  props.forEach((prop) => {
    if (t.isProperty(prop)) {
      if (t.isIdentifier(prop.key))
        propKeys.push(prop.key.name);
      else if (t.isLiteral(prop.key))
        propKeys.push(prop.key.value);
    } else if (t.isSpreadElement(prop)) {
      if (t.isIdentifier(prop.argument) && spreadNameMaps.has(prop.argument.name)) {
        getAllKeys(spreadNameMaps.get(prop.argument.name), spreadNameMaps)
          .forEach((name) => propKeys.push(name));
      }
    }
  });
  return propKeys;
};

/**
 * @type {import("eslint").Rule.RuleModule}
 */
const ruleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'suggest outputStrings in cactbot',
      category: 'Stylistic Issues',
      recommended: true,
      url: 'https://github.com/quisquous/cactbot/blob/main/docs/RaidbossGuide.md#trigger-elements',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noOutputStrings: 'no outputStrings in trigger',
      notFoundProperty: 'no \'{{prop}}\' in \'{{outputParam}}\'',
    },
  },
  create: function(context) {
    const sourceCode = context.getSourceCode();
    const spreadNameMaps = new Map();
    return {
      VariableDeclarator(node) {
        if (t.isIdentifier(node.id) && t.isObjectExpression(node.init))
          spreadNameMaps.set(node.id.name, node.init.properties);
      },
      ObjectExpression(node) {
        const propNames = getAllKeys(node.properties, spreadNameMaps);
        if (propNames.includes('id') && propNames.some((name) => textProps.includes(name))) {
          if (!node.properties.find((prop) => prop.key && prop.key.name === 'outputStrings')) {
            context.report({
              node: node,
              messageId: 'noOutputStrings',
            });
          } else {
            const outputStringProps = (() => {
              const propNames = [];
              const outputProps = node.properties.find((prop) => prop.key && prop.key.name === 'outputStrings');
              if (outputProps && outputProps.value && outputProps.value.properties) {
                getAllKeys(outputProps.value.properties, spreadNameMaps)
                  .forEach((n) => propNames.push(n));
              } else if (outputProps && t.isIdentifier(outputProps.value)) {
                const obj = spreadNameMaps.get(outputProps.value.name);
                if (obj)
                  getAllKeys(obj, spreadNameMaps).forEach((n) => propNames.push(n));
              }
              return propNames;
            })();
            if (!outputStringProps) return;
            const textFunctions = node
              .properties
              .filter((prop) => textProps.includes(prop.key.name))
              .map((prop) => prop.value);
            textFunctions.forEach((func) => {
              if (!t.isFunctionExpression(func) && !t.isArrowFunctionExpression(func)) return;
              const outputParam = func.params[2] && func.params[2].name;
              if (!outputParam) return;

              const source = sourceCode.getText(func);
              const m = source.match(new RegExp(`(?<=${outputParam}\\.)(\\w+)(?=\\()`, 'g'));
              if (!m) return;

              m.forEach((outputProperty) => {
                if (!outputStringProps.includes(outputProperty)) {
                  context.report({
                    node: func,
                    messageId: 'notFoundProperty',
                    data: {
                      prop: outputProperty,
                      outputParam: outputParam,
                    },
                  });
                }
              });
            });
          }
        }
      },
    };
  },
};

module.exports = ruleModule;
