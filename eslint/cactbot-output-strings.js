const t = require('@babel/types');
const textProps = ['alarmText', 'alertText', 'infoText', 'tts'];

/** @typedef {import("eslint").Rule.RuleContext} Context */
/**
 * get all keys name from object literal expression
 * @param {(t.Property|t.SpreadElement)[]} props
 * @param {Context} context
 * @return {string[]}
 */
const getAllKeys = (props, context) => {
  const propKeys = [];

  if (typeof props === 'undefined') return propKeys;

  const vars = context.getScope().variables;

  props.forEach((prop) => {
    if (t.isProperty(prop)) {
      if (t.isIdentifier(prop.key))
        propKeys.push(prop.key.name);
      else if (t.isLiteral(prop.key))
        propKeys.push(prop.key.value);
    } else if (t.isSpreadElement(prop)) {
      if (t.isIdentifier(prop.argument)) {
        const variable = vars.find((v) => v.name === prop.argument.name);
        if (!variable) return;
        const props = variable.defs.map((def) => {
          if (t.isVariableDeclarator(def.node) && t.isObjectExpression(def.node.init))
            return def.node.init.properties;
        })
          .filter((p) => typeof p !== 'undefined')
          .forEach((p) => {
            getAllKeys(p, context)
              .forEach((name) => propKeys.push(name));
          });
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
    return {
      ObjectExpression(node) {
        const propNames = getAllKeys(node.properties, context);
        if (!propNames.includes('id') || !propNames.some((name) => textProps.includes(name))) return;

        if (!node.properties.find((prop) => prop.key && prop.key.name === 'outputStrings')) {
          context.report({
            node: node,
            messageId: 'noOutputStrings',
          });
          return;
        }
        const outputStringProps = (() => {
          const propNames = [];
          const outputProps = node.properties.find((prop) => prop.key && prop.key.name === 'outputStrings');
          if (outputProps && outputProps.value && outputProps.value.properties) {
            getAllKeys(outputProps.value.properties, context)
              .forEach((n) => propNames.push(n));
          } else if (outputProps && t.isIdentifier(outputProps.value)) {
            const obj = context
              .getScope()
              .variables
              .find((variable) => variable.name === outputProps.value.name);
            if (obj) {
              obj.defs.forEach((def) => {
                const props = def.node.init && def.node.init.properties;
                getAllKeys(props, context).forEach((n) => propNames.push(n));
              });
            }
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
          const m = source.match(new RegExp(`(?<=\\b${outputParam}\\.)(\\w+)(?=\\()`, 'g'));
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
      },
    };
  },
};

module.exports = ruleModule;
