const t = require('@babel/types');
const textProps = ['alarmText', 'alertText', 'infoText', 'tts'];

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
      notFoundTemplate: '`output.{{prop}}(...)` doesn\'t have template \'{{template}}\'.',
      missingTemplateValue: 'template \'{{prop}}\' is missing in function call',
      tooManyParams: 'function `output.{{call}}()` takes only 1 parameter',
      typeError: 'function `output.{{call}}(...) only takes an object as a parameter',
    },
  },
  create: function(context) {
    const globalVars = new Map();
    const stack = {
      outputParam: null,
      outputProperties: [],
      inTriggerFunc: false,
    };
    /**
     * get all keys name from object literal expression
     * @param {(t.Property|t.SpreadElement)[]} props
     * @return {string[]}
     */
    const getAllKeys = (props) => {
      const propKeys = [];

      if (!props)
        return propKeys;

      props.forEach((prop) => {
        if (t.isProperty(prop)) {
          if (t.isIdentifier(prop.key))
            propKeys.push(prop.key.name);
          else if (t.isLiteral(prop.key))
            propKeys.push(prop.key.value);
        } else if (t.isSpreadElement(prop)) {
          if (t.isIdentifier(prop.argument)) {
            (globalVars.get(prop.argument.name) || [])
              .forEach((name) => propKeys.push(name));
          }
        }
      });
      return propKeys;
    };

    /**
     *
     * @param node {t.ObjectExpression}
     */
    const extractTemplate = function(node) {
      if (node.properties === undefined)
        return;
      const outputTemplateKey = {};
      for (const outputString of
        node.properties.filter((s) => !t.isSpreadElement(s) && !t.isMemberExpression(s.value))) {
        // For each outputString...
        const properties = outputString.value.properties;
        // This could just be a literal, e.g. `outputStrings: { text: 'string' }`.
        if (!properties)
          return;

        const values = properties.map((x) => x.value.value)
          .filter((x) => x !== undefined) || [];

        const templateIds = values
          .map((x) => Array.from(x.matchAll(/\${\s*([^}\s]+)\s*}/g)))
          .map((x) => x.length ? x.map((v) => v[1]) : null);

        if (arrayContainSameElement(templateIds))
          outputTemplateKey[outputString.key.name] = templateIds[0];
      }
      return outputTemplateKey;
    };

    const arrayContainSameElement = (arr) => {
      return arr.every((v) => JSON.stringify(v) === JSON.stringify(arr[0]));
    };

    return {
      /**
       *
       * @param node {t.ObjectExpression}
       */
      'Program > VariableDeclaration > VariableDeclarator > ObjectExpression'(node) {
        globalVars.set(node.parent.id.name, getAllKeys(node.properties));
      },
      [`Property[key.name=/${textProps.join('|')}/] > :function`](node) {
        const props = getAllKeys(node.parent.parent.properties);
        if (props.find((prop) => prop === 'outputStrings')) {
          stack.inTriggerFunc = true;
          stack.outputParam = node.params[2] && node.params[2].name;
          const outputValue = node.parent.parent.properties.find((prop) => prop.key && prop.key.name === 'outputStrings').value;
          stack.outputTemplates = extractTemplate(outputValue);
          stack.outputProperties =
            t.isIdentifier(outputValue)
              ? (globalVars.get(outputValue.name) || [])
              : getAllKeys(outputValue.properties);
          stack.triggerID = node.parent.parent.properties.find((prop) => prop.key && prop.key.name === 'id')?.value?.value;
          return;
        }
        context.report({
          node: node.parent.key,
          messageId: 'noOutputStrings',
        });
      },
      [`Property[key.name=/${textProps.join('|')}/] > :function:exit`]() {
        if (stack.inTriggerFunc) {
          stack.inTriggerFunc = false;
          stack.outputParam = null;
          stack.outputProperties = [];
          stack.triggerID = null;
          stack.outputTemplates = {};
        }
      },
      /**
       *
       * @param node {t.MemberExpression}
       */
      [`Property[key.name=/${textProps.join('|')}/] > :function[params.length=3] CallExpression > MemberExpression`](node) {
        if (node.object.name === stack.outputParam &&
          node.computed === false &&
          t.isIdentifier(node.property) &&
          !stack.outputProperties.includes(node.property.name)) {
          context.report({
            node: node,
            messageId: 'notFoundProperty',
            data: {
              prop: node.property.name,
              outputParam: stack.outputParam,
            },
          });
        }
        if (t.isIdentifier(node.property) && stack.outputProperties.includes(node.property.name)) {
          const args = node.parent.callee.parent.arguments;
          const outputOfTriggerId = stack.outputTemplates ?? {};
          const outputTemplate = outputOfTriggerId?.[node.property.name];

          if (args.length === 0) {
            if (node.property.name in outputOfTriggerId) {
              if (outputOfTriggerId[node.property.name] !== null) {
                context.report({
                  node,
                  messageId: 'missingTemplateValue',
                  data: {
                    prop: outputTemplate,
                  },
                });
              }
            }
          } else if (args.length === 1) {
            if (t.isObjectExpression(args[0])) {
              const passedKeys = getAllKeys(args[0].properties);
              if (outputTemplate === null && passedKeys.length !== 0) {
                context.report({
                  node,
                  messageId: 'notFoundTemplate',
                  data: {
                    template: passedKeys.join(', '),
                    prop: node.property.name,
                  },
                });
              }
            } else if (t.isLiteral(args[0])) {
              context.report({
                node,
                messageId: 'typeError',
                data: {
                  call: node.property.name,
                },
              });
            }

            const keysInParams = getAllKeys(args[0].properties);
            if (outputTemplate !== null && outputTemplate !== undefined) {
              for (const key of outputTemplate) {
                if (!t.isIdentifier(args[0]) && !keysInParams.includes(key)) {
                  context.report({
                    node,
                    messageId: 'missingTemplateValue',
                    data: {
                      prop: key,
                    },
                  });
                }
              }

              for (const key of keysInParams) {
                if (!outputTemplate.includes(key)) {
                  context.report({
                    node,
                    messageId: 'notFoundTemplate',
                    data: {
                      prop: node.property.name,
                      template: key,
                    },
                  });
                }
              }
            }
          } else {
            // args.length > 1
            context.report({
              node,
              messageId: 'tooManyParams',
              data: {
                call: node.property.name,
              },
            });
          }
        }
      },
    };
  },
};

module.exports = ruleModule;
